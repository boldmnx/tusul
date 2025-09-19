from django.http import JsonResponse

def schedule(request):
    schedule_data = [
        {"day": "Даваа", "lessons": ["Алгоритм", "Математик", "Физик"]},
        {"day": "Мягмар", "lessons": ["Программчлал", "Англи хэл"]},
        {"day": "Лхагва", "lessons": ["Бие даалт"]},
        {"day": "Пүрэв", "lessons": ["Математик", "Алгоритм", "Программчлал", "Англи хэл"]},
        {"day": "Баасан", "lessons": ["Амралт"]}
    ]
    return JsonResponse(schedule_data, safe=False)
