import requests
from bs4 import BeautifulSoup
import sqlite3
import base64
import shutil

BASE_URL = "https://caramel.kringlecastle.com/"
DB_FILENAME = "caramel.db"
RUN_LIMIT = 30

def initDB (name):
	db = sqlite3.connect(name)
	db.execute ('''
					CREATE TABLE IF NOT EXISTS location (
						name TEXT PRIMARY KEY,
						description TEXT,
						imageName TEXT
					)  
				''')
	db.execute ('''
					CREATE TABLE IF NOT EXISTS hint (
						description TEXT PRIMARY KEY
					)  
				''')
	return db

def insertDB (db, insertQuery, params):
	successFlag = False
	try:
		db.execute(insertQuery, params)
		db.commit()
		successFlag = True
	except sqlite3.IntegrityError as e: # Already exists
		successFlag = False
	except Exception as e:
		print ("Exception --> {} {}".format(type(e), e))
		exit(1)
	return successFlag

def sendRawRequest (url, session=None):
	try:
		if session == None:
			response = requests.get(url)
		else:
			response = session.get(url)
	except Exception as e:
		print ("Exception --> {} {}".format(type(e), e))
		print ("RETRY")
		sendRawRequest (url, session)
	return response

def sendRequest (url, session=None):
	response = sendRawRequest (url, session)
	soup = BeautifulSoup(response.text, features="lxml")
	return soup

def cleanText (text):
	if "bs4.element.Tag" in str(type(text)):
		text = text.getText()
	return text.lstrip().rstrip()

def getLinks (page, like=None):
	links = page.find_all('a')
	if like != None:
		hrefs = []
		for link in links:
			href = link.get("href")
			if like in href:
				hrefs.append(href)
	return hrefs

def downloadFile (url, name, session=None):
	response = sendRawRequest (url, session)
	fileBase64 = base64.b64encode(response.content)
	with open(name, 'wb') as outFile:
		outFile.write(response.content)
	return fileBase64

def getInvestigateLinks (page):
	return getLinks(page, "investigate")
def getDepartureLinks (page):
	return getLinks(page, "departure")

def addCity (page, url, session, db):
	# Get name, image and description
	name = cleanText(page.select('p.location.panel.uppercase', id='rcorners1')[0]).split("\n")[0]
	imageUrl = page.select('p.panel.fullimage', id='rcorners1')[0].img.get("src")
	imageName = imageUrl.split ("/")[-1]
	imageBase64 = downloadFile (url + imageUrl, imageName, session)
	description = cleanText (page.select('p.hint.panel', id='rcorners1')[0])

	# Save
	result = insertDB (db, 'INSERT INTO location VALUES (?,?,?)', (name, description, imageName))
	if result:
		print ("Found new city --> {}". format(name))
	return result

def investigate (mainPage, url, session, db):
	result = False
	randomHint = "They were dressed for "

	investigateLink = getInvestigateLinks (mainPage)[0]
	investigatePage = sendRequest(url + investigateLink, session)
	for link in getInvestigateLinks (investigatePage):
		investigatePage = sendRequest (url + link, session)
		hint = investigatePage.select('p.hint.panel', id='rcorners1')
		if len(hint) > 0:
			hint = hint[0]
			hintText = cleanText (investigatePage.select('p.hint.panel', id='rcorners1')[0])
			image = hint.select('img') # Hint has an image, download and append
			if randomHint in hintText: # Hint has a random part, strip it
				hintText = cleanText(hintText.split("\n")[1])
			if image:
				image = image[0]
				imageUrl = image.get("src")
				imageName = imageUrl.split ("/")[-1]
				imageBase64 = downloadFile (url + imageUrl, imageName, session)
				hintText += imageName

			newHint = insertDB (db, 'INSERT INTO hint VALUES (?)', (hintText,))
			result = newHint or result
			if newHint:
				print ("Found new hint --> {}". format(hintText))

	return result

def depart (mainPage, url, session, db):
	wrongMessage = "You've gone the wrong way"
	errorMessage = "Internal Server Error" # The app may complain when visiting a city unexpectedly

	newCity = None, None

	departureLink = getDepartureLinks (mainPage)
	if len(departureLink) > 0:
		departureLink = departureLink[0]
		departurePage = sendRequest (url + departureLink, session)
		departureLinks = getDepartureLinks(departurePage)[:-1]
		
		for link in departureLinks:
			departurePage = sendRequest (url + link, session)
			if not departurePage.find_all(text=errorMessage):
				city = cleanText (departurePage.select("p.hint.panel", id="rcorners1")[0])
				if wrongMessage not in city:
					name = cleanText(departurePage.select('p.location.panel.uppercase', id='rcorners1')[0]).split("\n")[0]
					newCity = departurePage, name

	return newCity

def main():
	# Get DB
	db = initDB (DB_FILENAME)

	countToLimit = 0
	runNumber = 1
	while countToLimit < RUN_LIMIT:
		addedSomething = False
		print ("Run number {}".format(runNumber))
		# Get a new session
		session = requests.Session()
	
		# Start game
		startGameLink = sendRequest(BASE_URL, session).a.get("href")
		
		# Get main page
		mainPage = sendRequest(BASE_URL + startGameLink, session)
		while mainPage:
			addedSomething = addCity (mainPage, BASE_URL, session, db) or addedSomething
			addedSomething = investigate (mainPage, BASE_URL, session, db) or addedSomething
			mainPage, name = depart(mainPage, BASE_URL, session, db)
			if mainPage:
				print ("Departed to --> {}".format(name))

		if addedSomething:
			countToLimit = 0
		else:
			countToLimit += 1
			print ("Ran {} times without adding anything".format(countToLimit))
		runNumber += 1

if __name__ == "__main__":
	main()
