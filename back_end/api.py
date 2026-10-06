import math
import os
import sys

import psycopg2
from psycopg2 import errors
from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

# --- Configuração do PostgreSQL (via variáveis de ambiente) ---
# No Windows (cmd), antes de rodar:
#   set DB_PASS=senha_do_postgres_do_elias
#   python api.py
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_NAME = os.environ.get("DB_NAME", "tcc_iot")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASS = os.environ.get("DB_PASS")

if not DB_PASS:
    sys.exit("Defina a variavel de ambiente DB_PASS antes de iniciar a API (ex.: set DB_PASS=sua_senha).")

CAMPOS = ("id_sensor", "leitura_gas_bruta", "temperatura", "umidade")


def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        connect_timeout=5,
    )


def validar_payload(dados):
    """Retorna (valores, None) se ok ou (None, mensagem_de_erro)."""
    if not isinstance(dados, dict):
        return None, "Corpo da requisicao deve ser um JSON valido."

    faltando = [c for c in CAMPOS if dados.get(c) is None]
    if faltando:
        return None, f"Campos ausentes ou nulos: {', '.join(faltando)}"

    try:
        id_sensor = int(dados["id_sensor"])
        gas = float(dados["leitura_gas_bruta"])
        temp = float(dados["temperatura"])
        umid = float(dados["umidade"])
    except (TypeError, ValueError):
        return None, "Os campos devem ser numericos."

    # DHT22 devolve NaN quando a leitura falha; nao grava lixo no banco
    if not all(math.isfinite(v) for v in (gas, temp, umid)):
        return None, "Leitura invalida (NaN/infinito)."

    if not (-40 <= temp <= 80):
        return None, "Temperatura fora da faixa do sensor (-40 a 80 C)."
    if not (0 <= umid <= 100):
        return None, "Umidade fora da faixa (0 a 100 %)."

    return (id_sensor, temp, umid, gas), None


@app.route("/api/health", methods=["GET"])
def health():
    """Teste rapido: abra http://IP:5000/api/health no navegador do celular."""
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
        return jsonify({"api": "ok", "banco": "ok"}), 200
    except Exception as e:
        return jsonify({"api": "ok", "banco": "erro", "detalhe": str(e)}), 503
    finally:
        if conn:
            conn.close()


@app.route("/api/leituras", methods=["POST"])
def receber_dados():
    valores, erro = validar_payload(request.get_json(silent=True))
    if erro:
        print(f"Payload rejeitado: {erro}")
        return jsonify({"status": "erro", "mensagem": erro}), 400

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO leituras
                    (id_sensor, temperatura, umidade, leitura_gas_bruta)
                VALUES (%s, %s, %s, %s)
                RETURNING id_leitura
                """,
                valores,
            )
            id_leitura = cur.fetchone()[0]
        conn.commit()

        id_sensor, temp, umid, gas = valores
        print(f"OK id={id_leitura} | sensor={id_sensor} | T={temp} | U={umid} | gas={gas}")
        return jsonify({"status": "sucesso", "id_leitura": id_leitura}), 201

    except errors.ForeignKeyViolation:
        if conn:
            conn.rollback()
        msg = "id_sensor nao cadastrado em tb_sensor."
        print(f"Erro: {msg}")
        return jsonify({"status": "erro", "mensagem": msg}), 400

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Erro no pipeline: {e}")
        return jsonify({"status": "erro", "mensagem": "Falha ao gravar no banco."}), 500

    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    # debug=False: com host 0.0.0.0 o debugger do Flask ficaria exposto na rede do hotspot
    app.run(host="0.0.0.0", port=5000, debug=False)
