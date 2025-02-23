import whisper

model = whisper.load_model('base')
result = model.transcribe('test2.wav',fp16=False)
text = result['text']
print(text)

