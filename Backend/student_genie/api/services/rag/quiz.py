import os
import sys
import traceback
import json

from langchain_core.documents import Document

# Add the project root directory to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
print(project_root)
sys.path.insert(0, project_root)

from student_genie.api.services.model import ModelService
from student_genie.api.utils.load_pdf import load_pdf
from student_genie.api.utils.youtube import load_video, get_video_id

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

class QuizService:
    def __init__(self, path, is_video=False):
        self.service = ModelService()
        self.llm = self.service.get_llm_model()

        if self.llm is None:
            raise Exception('LLM not found')

        try:
            if not is_video:
                docs = load_pdf(path)
                if not isinstance(docs, list):
                    raise ValueError("load_pdf did not return a list of documents")
            else:
                video_text = load_video(get_video_id(path))
                print(video_text)
                docs = [Document(page_content=video_text)]

            split = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len
            )

            split_docs = split.split_documents(docs)
            print(f"Number of document chunks: {len(split_docs)}")

            self.embeddings = self.service.get_embedding_model()

            self.vectorstore = Chroma.from_documents(
                documents=split_docs,
                embedding=self.embeddings,
                persist_directory="./chroma_db"
            )

            self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 5})

            template = """
            Generate a quiz based on the following context. The quiz should have exactly 5 questions, including a mix of multiple-choice and true/false questions. Ensure that the questions cover key concepts from the context comprehensively.

            Context:
            {context}

            Instructions:
            1. Create a quiz with atleast 10 questions if possible you can generate more questions to covere all the more question cover all the content.
            2. Include both multiple-choice (with 4 options) and true/false questions.
            3. Ensure questions are directly related to the context provided.
            4. Provide the correct answer for each question.
            5. Format the output as a valid JSON object.

            Output the quiz in the following JSON format:
            [
                {{
                    "title": "Quiz Title",
                    "description": "Brief description of the quiz",
                    "questions": [
                        {{
                            "type": "multiple_choice",
                            "question": "Question text",
                            "choices": ["Option A", "Option B", "Option C", "Option D"],
                            "answer": 0
                        }},
                        {{
                            "type": "true_false",
                            "question": "True/False question text",
                            "answer": true
                        }}
                    ]
                }}
            ]

            Ensure the JSON is valid and properly formatted. The quiz should have exactly 5 questions.
            """

            self.prompt = PromptTemplate.from_template(template)

            self.chain = (
                RunnablePassthrough.assign(
                    context=lambda _: self._format_docs(self.retriever.get_relevant_documents(""))
                )
                | self.prompt
                | self.llm
                | StrOutputParser()
            )

        except Exception as e:
            print(f"An error occurred during initialization: {str(e)}")
            traceback.print_exc()
            raise

    def _format_docs(self, docs):
        return "\n\n".join(doc.page_content for doc in docs)

    def quiz(self):
        try:
            output = self.chain.invoke({})

            # Clean up the output
            cleaned_output = output.strip()
            if cleaned_output.startswith("```json"):
                cleaned_output = cleaned_output[7:]
            if cleaned_output.endswith("```"):
                cleaned_output = cleaned_output[:-3]

            # Parse JSON
            quiz_data = json.loads(cleaned_output)

            # Validate quiz structure
            if not isinstance(quiz_data, list) or len(quiz_data) == 0 or 'questions' not in quiz_data[0] or len(quiz_data[0]['questions']) != 5:
                raise ValueError("Invalid quiz structure or incorrect number of questions")

            return quiz_data

        except json.JSONDecodeError as je:
            print(f"JSON Decode Error: {str(je)}")
            return [{"error": "Failed to generate a valid quiz. Please try again."}]
        except Exception as e:
            print(f"An error occurred during quiz generation: {str(e)}")
            traceback.print_exc()
            return [{"error": "An unexpected error occurred while generating the quiz."}]

if __name__ == "__main__":
    try:
        quiz_service = QuizService("https://www.youtube.com/watch?v=jLSWPNPSoFs&t=55s", is_video=True)
        quiz_result = quiz_service.quiz()
        if "error" in quiz_result[0]:
            print("Error:", quiz_result[0]["error"])
        else:
            print("Successfully generated quiz:")
            print(json.dumps(quiz_result, indent=2))
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()