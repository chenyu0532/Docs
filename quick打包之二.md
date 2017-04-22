## 生成资源与对应的MD5(后面的热更新使用)

下面为python代码

	def readFile(path):
    	if os.path.isfile(path): 
        	file = open(path, 'rb')
        	content = file.read()
        	file.close()
        	return content
    	else:
        	return None

	def getMD5(data):
    	if data:
        	encodestr = base64.b64encode(data)
        	h=hashlib.md5(encodestr)
        	return h.hexdigest()
    	return "" 

	def findindir(path, r_table, intofolder = True):
    	for file in os.listdir(path):
       		f = path + "/" + file
        	if os.path.isfile(f): #查找的文件
            	r_table.append(f)
       		elif intofolder:
            	findindir(f, r_table, intofolder)

	def main(path, ver):
    	currentFolder = path
    	input_table = []
    	findindir(currentFolder, input_table)
    	buf = "local list = {\nver = \"" + ver + "\",\n"
    	buf = buf + "updurl = \"http://192.168.1.2:8889/source/res/\",\n"

    	buf = buf + "stage = {\n"
    	pthlen = len(currentFolder) + 1
    	#print("pthlen:",pthlen)
    	for file in input_table:      
        	suffix = file.split('.')[-1:][0]
        	# print("suffix1:",file.split('.'))
        	# print("suffix2:",file.split('.')[1:])  #第一个串为0，第二个串为1，所以截取的是第一个串后面的
        	# print("suffix2:",file.split('.')[-1:]) #截取的是最后一个字符串 -2：表示截取最后两个  以此类推
        	# print("suffix2:",file.split('.')[0:])   #0表示不截取，输出的是原串
        	# print("suffix3:",file.split('.')[0:][0]) #取第一个元素
        	canRead = False
        	isZip = False
        	for x in fileary:
           		if x == suffix:
                	canRead = True
                	if x == fileary[2]:
                    	isZip = True
                		break
        	if canRead:
            	buf = buf + "\t{name=\"" + file[pthlen:] + "\", code=\""
            	data = readFile(file)
            	ms = getMD5(data)
        	fileSize = len(data)
        	buf = buf + ms + "\", size = " + str(fileSize)
        	if isZip:
            	buf = buf + ", act=\"load\"},\n"
       		else:
            	buf = buf + ", act=nil},\n"

    	buf = buf + "},\nremove = {},\n}\nreturn list"
    	rf = open(path + "/flist.lua" , "w")
    	rf.write(buf)
    	rf.close()
    	print("*************MESSAGE:*****************")
    	print("version:", ver)
    	print("MD5 path:", path)
    	print("MD5 file modification time: ", time.ctime(os.path.getmtime(path)))
    	print("\"flist\" file Path:", path)
    	print("**************************************")

		p = sys.argv[1]	
		v = sys.argv[2]
		if __name__ == '__main__':
		main(p, v)
	
	
