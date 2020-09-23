import speech_recognition as sr
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

json = './service_account.json'

cred = credentials.Certificate(json)

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://home-automation-a274b.firebaseio.com'
})

ref = db.reference('/users/k58wd2OhXSf48EXXk9nVkzGBF0a2/')


sample_rate = 48000
chunk_size = 2048

r = sr.Recognizer()

with sr.Microphone(sample_rate=sample_rate, chunk_size=chunk_size) as source:
    r.adjust_for_ambient_noise(source)
    print("Hello! What's that Query?")
    audio = r.listen(source)
    data = {}

    try:
        query = r.recognize_google(audio)

        if 'on' in query:
            data = {'light': 1}
        elif 'off' in query:
            data = {'light': 0}

        ref.set(data)
        print('The light is {}'.format('on!' if data['light'] else 'off!'))

    except sr.UnknownValueError:
        print("Sorry! Could'nt quite catch that!")

    except sr.RequestError as e:
        print("Seems your network is low :/".format(e))
