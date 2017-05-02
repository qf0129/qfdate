from bottle import route,get,run,static_file


@route('/')
def index():
    return static_file('test.html', root='/home/qf/work/qfdate/test')

run(host='0.0.0.0',port=8080)