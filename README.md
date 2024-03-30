run on the server, this can load the location log (andlog) , with amap js api show the locations .

add public IP to ALLOWED_HOSTS

```bash
export pubIP="111.222.333.444"
```

or directly modify `haha2/settings.py`

then run server

```bash
python3 manage.py runserver 0.0.0.0:12345
```