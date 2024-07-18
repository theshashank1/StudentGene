import os
import sys
import traceback
import re

# Add the project root directory to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
sys.path.insert(0, project_root)

from student_genie.api.services.model import ModelService
from student_genie.api.utils.load_pdf import load_pdf

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser, BaseOutputParser
from langchain_core.runnables import RunnablePassthrough




# Define the extract_triple_quote_content function
def extract_triple_quote_content(text):
    pattern = r'```\s*(.*?)\s*```'
    matches = re.findall(pattern, text, re.DOTALL)
    result = "\n".join(matches)
    return result[4:]

# Custom parser class
class TripleQuoteContentParser(BaseOutputParser):
    @staticmethod
    def parse(text):
        return extract_triple_quote_content(text)



class QuizService:
    def __init__(self, pdf_path) :
        self.service = ModelService()
        self.llm = self.service.get_llm_model()

        if self.llm is None :
            raise Exception('LLM not found')

        try :
            doc = load_pdf(pdf_path)

            # This will split the document into chunks with a specified size and overlap
            split = RecursiveCharacterTextSplitter(
                chunk_size=600,
                chunk_overlap=50,
                length_function=len
            )

            # Splitting the document into chunks for better processing
            split_docs = split.split_documents(doc)

            print(f"Number of document chunks: {len(split_docs)}")

            self.embeddings = self.service.get_embedding_model()

            # Creating a Chroma vector database from the document chunks and embeddings
            self.vectorstore = Chroma.from_documents(
                documents=split_docs,  # Data: the split document chunks
                embedding=self.embeddings,  # Embedding model
                persist_directory="./chroma_db"  # Directory to save the vector database
            )

            self.retriever = self.vectorstore.as_retriever()

            # Define a template for the prompt
            template = """
            Generate a list of multiple-choice questions (MCQs) and true/false questions based solely on the following context. Ensure that the questions cover all aspects of the context comprehensively. The number of questions should be at least 10, but you can generate more if necessary to cover the context thoroughly. Provide the questions in a JSON array format. Each question should include the correct answer.

            Context:
            {context}

            Output Format:
            [
              {{
                "type": "MCQ",
                "question": "First multiple-choice question?",
                "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                "correct_answer": "Option 1"
              }},
              {{
                "type": "True/False",
                "question": "First true/false question?",
                "correct_answer": true
              }},
              ...
            ]
            """

            # Create a prompt template from the defined template
            self.prompt = PromptTemplate.from_template(template)

            # Define the chain or pipeline to execute the retrieval, prompt, model, and output parsing
            self.chain = (
                    RunnablePassthrough.assign(
                        context=lambda _ : self._format_docs(self.retriever.get_relevant_documents(""))
                    )
                    | self.prompt
                    | self.llm
                    | StrOutputParser()
                    | TripleQuoteContentParser()
            )

        except Exception as e :
            print(f"An error occurred during initialization: {str(e)}")
            traceback.print_exc()
            raise

    def _format_docs(self, docs) :
        return "\n\n".join(doc.page_content for doc in docs)


    def quiz(self) :
        try :
            # Invoke the chain
            output = self.chain.invoke({})
            return output
        except Exception as e :
            print(f"An error occurred during quiz generation: {str(e)}")
            traceback.print_exc()
            return "I'm sorry, but I encountered an error while generating the quiz."


if __name__ == "__main__" :
    pdf = r"E:\Music_and_Movie_Recommendation_System (1).pdf"
    quiz_service = QuizService(pdf)
    questions = quiz_service.quiz()

    print(questions)  # This will print the error message if an exception occurred
