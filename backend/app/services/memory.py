# ============================================================
# ARQUIVO: services/memory.py — Gerenciamento de Histórico de Chat
# ============================================================
# Armazena o histórico de conversa por usuário em memória.
# Cada usuário (identificado pelo user_id do JWT) tem seu próprio histórico.
# ============================================================

from collections import defaultdict

from app.config import CHAT_HISTORY_MAX_MESSAGES


# CONCEITO: defaultdict
# É um dicionário que cria automaticamente um valor padrão
# quando você acessa uma chave que não existe.
# defaultdict(list) = se a chave não existir, cria uma lista vazia.
#
# Estrutura:
# {
#     "user_id_abc": [
#         {"role": "user", "content": "o que é FV?"},
#         {"role": "assistant", "content": "FV é fibrilação ventricular..."},
#         {"role": "user", "content": "qual a dose de amiodarona?"},
#         {"role": "assistant", "content": "A dose é 300mg IV..."},
#     ],
#     "user_id_xyz": [ ... ]
# }
_chat_histories: dict[str, list[dict]] = defaultdict(list)


def get_history(user_id: str) -> list[dict]:
    """Retorna o histórico de chat do usuário.

    Retorna apenas as últimas N interações (configurado em CHAT_HISTORY_MAX_MESSAGES).
    Cada interação = 2 mensagens (user + assistant), então o limite real é N * 2.
    """
    max_messages = CHAT_HISTORY_MAX_MESSAGES * 2
    return _chat_histories[user_id][-max_messages:]


def add_to_history(user_id: str, role: str, content: str) -> None:
    """Adiciona uma mensagem ao histórico do usuário.

    Args:
        user_id: identificador do usuário (vem do JWT)
        role: "user" ou "assistant"
        content: texto da mensagem
    """
    _chat_histories[user_id].append({"role": role, "content": content})

    # Limita o tamanho total para não consumir memória infinita.
    # Mantém o dobro do limite para ter margem.
    max_stored = CHAT_HISTORY_MAX_MESSAGES * 4
    if len(_chat_histories[user_id]) > max_stored:
        _chat_histories[user_id] = _chat_histories[user_id][-max_stored:]


def clear_history(user_id: str) -> None:
    """Limpa o histórico de um usuário específico."""
    _chat_histories[user_id] = []