from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from datetime import datetime

import os

def get_log_data():
    os.system("cat ~/andlog | tail -n 2000 | cut -d ':' -f 2 > tmplog")
    log_data = []
    with open ('tmplog', 'r') as f:
        lines = f.readlines()
        for line in lines:
            parts = line.strip()
            onePart = parts.split(',')
            if len(onePart) == 4:
                onePart.append(-1)
                log_data.append(onePart)
            elif len(onePart) == 5:
                onePart[4] = str(3.6 * float(onePart[4]))
                log_data.append(onePart)
    for t in log_data:
        time_obj = datetime.strptime(t[1], "%Y%m%d%H%M%S")
        t[1] = time_obj.strftime("%Y-%m-%d_%H:%M:%S")
    os.system("rm tmplog")
    log_data.reverse()
    return log_data

def get_log_data_bytime(firsttime):
    log_data_2k = get_log_data()
    log_data = []
    for t in log_data_2k:
        if t[1] > firsttime:
            log_data.append(t)

    return log_data

@login_required
def index(request):
    logdata = get_log_data()
    for i in range(len(logdata)):
        logdata[i].insert(0, i + 1)
    return render(request, "getloc/index.html", {'logdata': logdata})

@login_required
def reload_log_data(request):
    logdata = get_log_data_bytime(request.GET.get('firstTime', None))
    for i in range(len(logdata)):
        logdata[i].insert(0, i + 1)
    return JsonResponse(logdata, safe=False)
