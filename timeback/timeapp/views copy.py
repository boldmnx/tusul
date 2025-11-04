import random
from collections import defaultdict
import sqlite3 as sql
from django.shortcuts import render
from .models import *
import itertools


DAYS = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]

TIMES = [
    '08:00-09:30',
    '09:40-11:10',
    '11:20-12:50',
    '13:30-15:00',
    '15:10-16:40',
]


def schedule_view(request):

    data = Course.objects.all().values("name", "teacher", "lesson_type",
                                       "available_room_types", "group_list")
    course = []
    grouped = defaultdict(
        lambda: {'available_room_types': None, 'group_list': []})

    for item in data:
        if item['lesson_type'] == 'лекц':
            key = (item['name'], item['teacher'], item['lesson_type'])
            grouped[key]['available_room_types'] = item['available_room_types']
            grouped[key]['group_list'].append(item['group_list'])
        else:
            # харин лаб, семинар гэх мэт нь тус бүр тусдаа мөр болно
            course.append({
                'name': item['name'],
                'teacher': item['teacher'],
                'lesson_type': item['lesson_type'],
                'available_room_types': item['available_room_types'],
                'group_list': [item['group_list']]
            })
    for (name, teacher, lesson_type), values in grouped.items():
        course.append({
            'name': name,
            'teacher': teacher,
            'lesson_type': lesson_type,
            'available_room_types': values['available_room_types'],
            'group_list': values['group_list']
        })
    # done

    schedules = generate_schedules(course)
    for i, sch in enumerate(schedules[:3], 1):  # эхний 10-г хэвлэе
        print(f"--- Хуваарь {i} ---")
    for d, t, r, c in sch:
        print(
            f"{d} {t} | {c['name']} ({c['lesson_type']}) | өрөө {r['id']} | багш {c['teacher']} | анги {c['group_list']}")
    print()
    return render(request, "schedule.html")


def generate_schedules(courses):
    rooms = Room.objects.all().values("room_type", "room_number")
    room_map = {r["room_type"]: r["room_number"] for r in rooms}
    # done

    all_slots = [(d, t) for d in DAYS for t in TIMES]

    options_per_course = []
    for c in courses:
        opts = []
        for room_type in c['available_room_types']:
            for room in room_map[room_type]:
                for day, time in all_slots:
                    opts.append((day, time, room, c))
        options_per_course.append(opts)

    all_combinations = itertools.product(*options_per_course)

    if len(courses) <= 4:
        all_combinations = itertools.product(*options_per_course)
    else:
        # 4-өөс дээш бол random эсвэл heuristic
        return generate_schedules_random(courses)

    valid_schedules = []
    for comb in all_combinations:
        schedule = []
        valid = True
        for entry in comb:
            if is_conflict(schedule, entry):
                valid = False
                break
            schedule.append(entry)
        if valid:
            valid_schedules.append(schedule)

    return valid_schedules


def is_conflict(schedule, new):
    """Шинэ хичээлийг өмнөхүүдтэй харьцуулж зөрчил шалгах"""
    nd, nt, nr, course = new
    teacher = course["teacher"]
    groups = set(course["group_list"])

    for (d, t, r, c) in schedule:
        # ижил цаг өдөр дээр шалгах
        if d == nd and t == nt:
            # багш давхцах эсэх
            if c["teacher"] == teacher:
                return True
            # өрөө давхцах эсэх
            if r["id"] == nr["id"]:
                return True
            # анги давхцах эсэх
            if groups & set(c["group_list"]):
                return True
    return False


def generate_schedules_random(courses):
    rooms = list(Room.objects.all().values("room_type", "room_number"))
    room_map = {r["room_type"]: r["room_number"] for r in rooms}

    all_slots = [(d, t) for d in DAYS for t in TIMES]

    schedule = []
    tries = 0

    while len(schedule) < len(courses) and tries < 1000:
        tries += 1
        course = courses[len(schedule)]
        room_type = random.choice(course['available_room_types'])
        room = random.choice(room_map[room_type])
        day, time = random.choice(all_slots)
        entry = (day, time, room, course)

        if not is_conflict(schedule, entry):
            schedule.append(entry)

    return [schedule]  # жагсаалт хэлбэртэй буцаана
