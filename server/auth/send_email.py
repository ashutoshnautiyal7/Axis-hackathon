import smtplib
import ssl
from email.message import EmailMessage

from email.message import EmailMessage
import smtplib
import ssl
import ast

def send_email(email_sender, email_password, email_receiver, subject, body):
    # COnvert the string to list
    email_receiver = ast.literal_eval(email_receiver)

    for i in range(len(email_receiver)):
        em = EmailMessage()
        em['From'] = email_sender
        em['To'] = str(email_receiver[i])
        em['Subject'] = subject
        em.set_content(body)

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(email_sender, email_password)
            smtp.send_message(em)  # Send the EmailMessage object

        print('Email sent successfully')
    return 200


# email_sender = 'test.purposes27.5@gmail.com'
# email_password = 'fhwjldldvnoqzxel'  # Replace this with the app-generated password
# email_receiver = 'p.priyadharshinicse2020@gmail.com'
# subject = 'This is a test mail'
# body = """
# Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
# """

# send_email(email_sender, email_password, email_receiver, subject, body)

