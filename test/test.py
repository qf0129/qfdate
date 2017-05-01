from bottle import route,get,run,static_file


@route('/')
def index():
    return static_file('index.html', root='C:/Users/qf/Desktop')


run(host='0.0.0.0',port=80)