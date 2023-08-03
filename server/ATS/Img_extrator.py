import easyocr
def ocr(file_path):
    # deployment note: if easyocr is final we need to deploy in a system with CUDA or MPS for faster performance
    """return text in the resume prsent in image format.
       it uses conv2 nn ,there is a delay need to improvise
       
    Args:
        file_path (path):Scr image path

    Returns:
        List: list of character present in the image
    """
    reader = easyocr.Reader(['en'])
    result_confidence= reader.readtext(file_path) 
    #result_confidence[0] location (co-ordinates)
    #result_confidence[1] text
    #result_confidence[2] confidence score for each text
    extracted_text = [item[1] for item in result_confidence]
    return extracted_text  
# text=ocr("sample.jpg")
# text contains the list of words in the Image