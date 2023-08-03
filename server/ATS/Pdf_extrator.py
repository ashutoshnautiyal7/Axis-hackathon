from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.layout import LAParams
from pdfminer.converter import TextConverter
import io

def pdf_parser(pdf_path):
    """
        It can extract words form the pdf , the formatting may change but the words is not altered.
        NOTE:The pdf should not have any image that contains words inside it.
        
    Args:
        pdf_path (path): use the relative path or full path if it is a full path mention use // instead of / in the path 

    Returns:
        String: Extracted text from the Resume
    """
    resource_manager = PDFResourceManager()
    fake_file_handle = io.StringIO()
    converter = TextConverter(resource_manager, fake_file_handle, laparams=LAParams())
    page_interpreter = PDFPageInterpreter(resource_manager, converter)

    with open(pdf_path, 'rb') as fh:
        for page in PDFPage.get_pages(fh, caching=True, check_extractable=True):
            page_interpreter.process_page(page)

        text = fake_file_handle.getvalue()

    converter.close()
    fake_file_handle.close()

    return text
