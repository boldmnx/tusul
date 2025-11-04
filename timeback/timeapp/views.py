import json
import random
from collections import defaultdict
from django.http import JsonResponse
from django.shortcuts import render
from .models import *
import itertools

DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
TIMES = ['08:00-09:30', '09:40-11:10',
         '11:20-12:50', '13:30-15:00', '15:10-16:40']


def schedule_view(request):
    data = Course.objects.all().values("name", "teacher", "lesson_type",
                                       "available_room_types", "group_list")
    course = []
    grouped = defaultdict(
        lambda: {'available_room_types': None, 'group_list': []})

    # Лекцүүдийг нэгтгэх
    for item in data:
        if item['lesson_type'] == 'лекц':
            key = (item['name'], item['teacher'], item['lesson_type'])
            grouped[key]['available_room_types'] = item['available_room_types']
            grouped[key]['group_list'].append(item['group_list'])
        else:
            course.append({
                'name': item['name'],
                'teacher': item['teacher'],
                'lesson_type': item['lesson_type'],
                'available_room_types': item['available_room_types'],
                'group_list': [item['group_list']]
            })
    for (name, teacher, lesson_type), values in grouped.items():
        course.insert(0, {  # Лекцүүдийг эхэнд нэмнэ
            'name': name,
            'teacher': teacher,
            'lesson_type': lesson_type,
            'available_room_types': values['available_room_types'],
            'group_list': values['group_list']
        })

    # Schedule үүсгэх
    schedules = generate_schedules(course, num_schedules=10)
    formatted_schedules = []
    for i, sch in enumerate(schedules, 1):
        entries = []
        for day, time, room, course in sch:
            entries.append({
                "day": day,
                "time": time,
                "course_name": course["name"],
                "lesson_type": course["lesson_type"],
                "room": room["id"],
                "teacher": course["teacher"],
                "groups": course["group_list"]
            })
        formatted_schedules.append({
            "schedule_number": i,
            "entries": entries
        })

    return JsonResponse(formatted_schedules, safe=False)
    # Хэвлэх
    # for i, sch in enumerate(schedules[:3], 1):
    #     print(f"--- Хуваарь {i} ---")
    #     for d, t, r, c in sch:
    #         print(
    #             f"{d} {t} | {c['name']} ({c['lesson_type']}) | өрөө {r['id']} | багш {c['teacher']} | анги {c['group_list']}")
    #     print()
    # return JsonResponse(schedules, safe=False)
    # return render(request, "schedule.html")


def is_conflict(schedule, new):
    nd, nt, nr, course = new
    teacher = course["teacher"]
    groups = set(course["group_list"])

    for (d, t, r, c) in schedule:
        if d == nd and t == nt:
            if c["teacher"] == teacher:
                return True
            if r["id"] == nr["id"]:
                return True
            if groups & set(c["group_list"]):
                return True
    return False


def generate_schedules(courses, num_schedules=10):
    rooms = list(Room.objects.all().values("room_type", "id"))
    room_map = defaultdict(list)
    for r in rooms:
        room_map[r["room_type"]].append(r)

    all_slots = [(d, t) for d in DAYS for t in TIMES]

    schedules = []
    tries = 0
    max_tries = num_schedules * 3000

    while len(schedules) < num_schedules and tries < max_tries:
        tries += 1
        schedule = []

        # Shuffle courses to get different schedules
        random_courses = courses[:]
        random.shuffle(random_courses)

        for course in random_courses:
            placed = False
            for day, time in all_slots:
                for room_type in course['available_room_types']:
                    for room in room_map.get(room_type, []):
                        entry = (day, time, room, course)
                        if not is_conflict(schedule, entry):
                            schedule.append(entry)
                            placed = True
                            break
                    if placed:
                        break
                if placed:
                    break

        if len(schedule) == len(courses) and schedule not in schedules:
            schedule.sort(key=lambda x: (DAYS.index(x[0]), TIMES.index(x[1])))
            schedules.append(schedule)

    return schedules
