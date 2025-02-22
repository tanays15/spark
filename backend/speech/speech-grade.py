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
        {"role": "system", "content": "You are an expert evaluator grading a speech based on accuracy and completeness in explaining the given topic. The speech is from a human talking naturally, so it may contain fillers, minor mispronunciations, or speech-to-text errors. Do not penalize for grammar, minor wording inconsistencies, or natural speech patterns. Instead, focus on factual correctness and whether the explanation fully covers the key aspects of the topic. The human may sometimes draw images on paper to illustrate the concept while speaking, but your evaluation should be based solely on the verbal (text) explanation provided. Your task is to analyze the content for correctness by checking if the key concepts are explained accurately and if there are any factual errors or misconceptions, and for completeness by evaluating whether the speech covers all essential components of the topic and if any important details are missing. The scoring scale is as follows: 90-100 (Exceptional) means the explanation is highly accurate, well-structured, and covers all key aspects of the topic with correct definitions, logic, and necessary details, with no major factual errors or missing components. 75-89 (Strong) means the explanation is mostly correct and covers the important details but may lack depth in some areas or contain minor factual inaccuracies that do not significantly impact understanding. 60-74 (Adequate) means the explanation is generally correct but some key points are missing, vague, or incomplete, with noticeable factual errors that affect clarity and requiring more precise definitions or examples. 40-59 (Weak) means the explanation has multiple inaccuracies or misconceptions, with key elements missing, and may be overly broad, confusing, or misleading, requiring significant improvement in accuracy and depth. 1-39 (Poor) means the explanation is mostly incorrect or fails to convey key ideas, containing major factual errors, misconceptions, or irrelevant or misleading information. Do not grade too harshly, and avoid being overly critical with the score. Provide constructive feedback that highlights strengths and areas for improvement while keeping the score fair. Do not deduct too many points for logical flow unless it affects factual accuracy. Ignore minor grammatical issues, mispronunciations, or speech inconsistencies. Focus on whether the explanation is correct and fully covers the topic. The output format should be: Score: X/100 Feedback: [Brief paragraph highlighting strengths and areas for improvement.] This ensures an objective, accuracy-focused evaluation while accounting for natural human speech without being overly harsh in scoring."},
        {"role": "user", "content": " The topic is binary search. Finer research is a recursive algorithm that takes in two integers or two parameters. One parameter is an unarray of integers in the second parameter is the integer that the algorithm is looking for. After that it starts at the far, it finds the median of the array using the left and right. Then it looks at the median and depending on the median it will, if the median is greater or less than the search integer, it will go to the right or the left. It keeps recursively doing that until it finds the integer. If it doesn't find the integer, it terminates. If it finds the integer it terminates. And that's it."}
      ]
    )
      
      text = completion.choices[0].message.content
    
      score_match = re.search(r'Score:\s*(\d+)/100', text)
      score = int(score_match.group(1)) if score_match else None

      feedback_match = re.search(r'Feedback:\s*(.*)', text, re.DOTALL)
      feedback = feedback_match.group(1).strip() if feedback_match else None

      result = {
            "score": score,
            "feedback": feedback
        }

      return json.dumps(result, indent=4)
    
    except Exception as e:
        return json.dumps({"error": str(e)}, indent=4)

# Example usage
file_path = "test2.wav"  # Replace with actual file path
print(extract_score_and_feedback(file_path))
