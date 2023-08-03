import re
from Pdf_extrator import pdf_parser

txt = pdf_parser("/Users/kuldeep/Project/Axis-Hack/server/data/8c36cb44-970a-4236-bdcd-05fc4a698d65/Kuldeep's Resume.pdf")
print(t)
# Extract grades
grade_regex = r'(?:\d{1,2}\.\d{1,2})'
grades = re.findall(grade_regex, txt)

# Extract years
year_regex = r'(?:\d{4}\s?-\s?\d{4})'
years = re.findall(year_regex, txt)
def replacer(string, noise_list):
    for v in noise_list:
        string = string.replace(v, ":")
    return string

# Extract college and degree information
data = replacer(txt, years)
cleaned_text = re.sub("(?:\w+\s?\:)", "**", data).split('\n')
college = []
degree = []
for i in cleaned_text:
    split_data = i.split("**")
    if len(split_data) == 2:  # Ensure that both college and degree are present in each entry
        college.append(split_data[0].replace(',', '').strip())
        degree.append(split_data[1].strip())

# Make sure the number of grades and years match
min_length = min(len(grades), len(years))
grades = grades[:min_length]
years = years[:min_length]

# Create the parsed output
parsed_output = []
for i in range(min_length):
    parsed_data = {
        "Institute": college[i],
        "Degree": degree[i],
        "Grades": grades[i],
        "Year of Passing": years[i].split('-')[1]
    }
    parsed_output.append(parsed_data)

print(parsed_output)
