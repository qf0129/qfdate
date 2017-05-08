from bottle import route,get,run,static_file


@route('/')
def index():
    return static_file('test.html', root='/home/qf/work/qfdate/test')

@route('/qfdatepicker_mobile.js')
def qfdatepicker_mobile():
    return static_file('qfdatepicker_mobile.js', root='/home/qf/work/qfdate/test')

run(host='0.0.0.0',port=8080)