from ..model import ModelService
from ...utils.load_pdf import load_pdf

from langchain_text_splitters import RecursiveCharacterTextSplitter

service = ModelService()


def chat(file: str) :
    llm = service.get_llm_model()

    if llm is None :
        raise Exception('LLM not found')
    else :
        doc = load_pdf(file)

        # This will split the document into chunks with a specified size and overlap
        split = RecursiveCharacterTextSplitter(
            chunk_size=500,  # Size of each chunk
            chunk_overlap=50,  # Overlap between chunks
            length_function=len  # Function to determine the length of the text
        )

        # Splitting the document into chunks for better processing
        split_docs = split.split_documents(doc)

        print(split_docs)

chat()


