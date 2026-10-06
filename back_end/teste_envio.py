import sys
import requests

# Uso:
#   python teste_envio.py                          -> testa em localhost
#   python teste_envio.py http://192.168.43.X:5000 -> testa o notebook do Elias pela rede
base = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:5000"

payload_fake = {
    "id_sensor": 1,
    "leitura_gas_bruta": 2150,
    "temperatura": 26.5,
    "umidade": 55.0,
}

print(f"Testando {base} ...")

try:
    saude = requests.get(f"{base}/api/health", timeout=5)
    print(f"[health] {saude.status_code} {saude.json()}")

    resposta = requests.post(f"{base}/api/leituras", json=payload_fake, timeout=5)
    print(f"[POST]   {resposta.status_code} {resposta.json()}")
except Exception as e:
    print(f"Erro ao tentar enviar os dados: {e}")
