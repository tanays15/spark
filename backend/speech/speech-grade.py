import json
import re
import whisper
import openai
import os
from dotenv import load_dotenv
    
load_dotenv()

def extract_score_and_feedback(file_path):
    try:
      model = whisper.load_model('base')
      result = model.transcribe(file_path,fp16=False)
      text = result['text']
      client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
      completion = client.chat.completions.create(
      model="gpt-4o",
      messages=[
        {"role": "system", "content": "You are an expert evaluator grading a speech based on accuracy and completeness in explaining the given topic. The speech is from a human talking naturally, so it may contain fillers, alternate wording like “finer research” or “unarray,” minor mispronunciations, or speech-to-text errors. These minor or incorrect terms should be completely ignored and should not appear in your final feedback. Focus solely on whether the explanation conveys the core concept accurately. Do not penalize for grammar, minor wording inconsistencies, or natural speech patterns. Also, do not comment on or mention any sorting requirements. Your task is to analyze the content strictly for factual correctness related to the essence of the topic and for completeness in covering its essential points. If there are any factual errors or misconceptions directly affecting the understanding of the topic itself, you may address them; otherwise, disregard any minor speech anomalies or imprecise terms.Use the following scoring scale: 90-100 (Exceptional): The explanation is highly accurate, well-structured, and covers all key aspects of the topic with correct definitions, logic, and necessary details, with no major factual errors or missing components. 75-89 (Strong): The explanation is mostly correct and covers the important details but may lack depth in some areas or contain minor factual inaccuracies that do not significantly impact understanding. 60-74 (Adequate): The explanation is generally correct but some key points are missing, vague, or incomplete, with noticeable factual errors that affect clarity and requiring more precise definitions or examples. 40-59 (Weak): The explanation has multiple inaccuracies or misconceptions, with key elements missing, and may be overly broad, confusing, or misleading, requiring significant improvement in accuracy and depth. 1-39 (Poor): The explanation is mostly incorrect or fails to convey key ideas, containing major factual errors, misconceptions, or irrelevant or misleading information. Do not grade too harshly, and avoid being overly critical with the score. Provide constructive feedback that highlights strengths and areas for improvement while keeping the score fair. Focus only on the correctness and completeness of the explanation. Do not deduct points for any minor wording issues, mispronunciations, or irrelevant speech-to-text artifacts.Your final output must follow this format exactly, with a new line after each label, and without referencing any ignored issues:Score: X/100 Feedback: Brief paragraph highlighting strengths and areas for improvement, strictly focusing on the core topic without mentioning minor speech errors or the sorting requirement. Suggested Resources: link1 link2 link3 ...and so on, up to 10 relevant links or articles without bullet points.Only provide resources directly related to the topic and do not exceed 10 total links."},
        {"role": "user", "content": " The topic is binary search. Finer research is a recursive algorithm that takes in two integers or two parameters. One parameter is an unarray of integers in the second parameter is the integer that the algorithm is looking for. After that it starts at the far, it finds the median of the array using the left and right. Then it looks at the median and depending on the median it will, if the median is greater or less than the search integer, it will go to the right or the left. It keeps recursively doing that until it finds the integer. If it doesn't find the integer, it terminates. If it finds the integer it terminates. And that's it."}
      ]
    )
      
      text = completion.choices[0].message.content
    
      score_match = re.search(r'Score:\s*(\d+)/100', text)
      score = int(score_match.group(1)) if score_match else None

      feedback_match = re.search(r'Feedback:\s*(.*?)\nSuggested Resources:', text, re.DOTALL)
      feedback = (feedback_match.group(1)) if feedback_match else None


      
      resouces_match = re.search(r'Suggested Resources:\s*(.*)', text, re.DOTALL)
      resouces = resouces_match.group(1).strip() if resouces_match else None
      result = {
            "score": score,
            "feedback": feedback,
            "resources": resouces
        }

      return json.dumps(result, indent=4)
    
    except Exception as e:
        return json.dumps({"error": str(e)}, indent=4)

# Example usage
file_path = "test/test2.wav"  # Replace with actual file path
print(extract_score_and_feedback(file_path))
