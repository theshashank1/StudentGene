import os
import sys
import traceback

from langchain.chains import MapReduceDocumentsChain, ReduceDocumentsChain
from langchain.chains.llm import LLMChain
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_text_splitters import CharacterTextSplitter

# Add the project root directory to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
print(project_root)
sys.path.insert(0, project_root)

from student_genie.api.services.model import ModelService
from student_genie.api.utils.load_pdf import load_pdf
from student_genie.api.utils.youtube import load_video, get_video_id

class SummarizeService:
    def __init__(self, path: str, is_video = False):
        self.service = ModelService()
        self.llm = self.service.get_llm_model()  # Note: Added parentheses to call the method

        if self.llm is None:
            raise Exception('LLM not found')

        try:

            docs = None
            if not is_video:
                docs = load_pdf(path)
            else:
                video_text = load_video(get_video_id(path))
                docs = [Document(page_content=video_text)]

            # Map
            map_template = """The following is a set of documents
            {docs}
            Based on this list of docs, please identify the main themes 
            Helpful Answer:"""
            map_prompt = PromptTemplate.from_template(map_template)
            map_chain = LLMChain(llm=self.llm, prompt=map_prompt)

            # Reduce
            reduce_template = """The following is set of summaries:
            {docs}
            Take these and distill it into a final, consolidated summary of the main themes. 
            Helpful Answer:"""
            reduce_prompt = PromptTemplate.from_template(reduce_template)

            # Run chain
            reduce_chain = LLMChain(llm=self.llm, prompt=reduce_prompt)

            # Takes a list of documents, combines them into a single string, and passes this to an LLMChain
            combine_documents_chain = StuffDocumentsChain(
                llm_chain=reduce_chain, document_variable_name="docs"
            )

            # Combines and iteratively reduces the mapped documents
            reduce_documents_chain = ReduceDocumentsChain(
                # This is final chain that is called.
                combine_documents_chain=combine_documents_chain,
                # If documents exceed context for `StuffDocumentsChain`
                collapse_documents_chain=combine_documents_chain,
                # The maximum number of tokens to group documents into.
                token_max=4000,
            )

            # Combining documents by mapping a chain over them, then combining results
            self.map_reduce_chain = MapReduceDocumentsChain(
                # Map chain
                llm_chain=map_chain,
                # Reduce chain
                reduce_documents_chain=reduce_documents_chain,
                # The variable name in the llm_chain to put the documents in
                document_variable_name="docs",
                # Return the results of the map steps in the output
                return_intermediate_steps=False,
            )

            text_splitter = CharacterTextSplitter.from_tiktoken_encoder(
                chunk_size=1000, chunk_overlap=0
            )
            self.split_docs = text_splitter.split_documents(docs)

        except Exception as e:
            print(f"An error occurred during initialization: {str(e)}")
            traceback.print_exc()
            raise

    def summarize(self):
        try:
            result = self.map_reduce_chain.invoke({"input_documents": self.split_docs})
            return result['output_text']
        except Exception as e:
            print(f"An error occurred during summarization: {str(e)}")
            traceback.print_exc()
            return str(e)

if __name__ == "__main__":
    try:
        # service = SummarizeService(r"E:\Music_and_Movie_Recommendation_System (1).pdf")
        service = SummarizeService("https://www.youtube.com/watch?v=o11J4oO-P28&t=1198s", video=1)
        summary = service.summarize()
        print(summary)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        traceback.print_exc()