from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

import os

def get_log_data():
    os.system("cat ~/andlog | tail -n 1000 | cut -d ':' -f 2 > tmplog")
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
        l = list(t[1])
        l.insert(12, ':')
        l.insert(10, ':')
        l.insert(8, '_')
        l.insert(6, '-')
        l.insert(4, '-')
        t[1] = ''.join(l)
    os.system("rm tmplog")
    log_data.reverse()
    return log_data

@login_required
def index(request):
    logdata = get_log_data()
    for i in range(len(logdata)):
        logdata[i].insert(0, i + 1)
    return render(request, "getloc/index.html", {'logdata': logdata})

@login_required
def reload_log_data(request):
    logdata = get_log_data()
    for i in range(len(logdata)):
        logdata[i].insert(0, i + 1)
    return JsonResponse(logdata, safe=False)
