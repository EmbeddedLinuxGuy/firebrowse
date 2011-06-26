#!/usr/bin/env python

#import httplib2
import sys
import os
import httplib

class Downloader():

    def __init__(self, host):
            self.conn = httplib.HTTPConnection(host)

    def get(self, url):
            self.conn.request("GET", url)
            resp = self.conn.getresponse()
            while True:
                    data = resp.read(10)
                    if not data:
                            break
                    yield data
def main():
#    url = "http://stream.twitter.com/1/statuses/sample.json?count=1"
#    url = "http://stream.twitter.com/1/statuses/filter.json?locations=-122.75,36.8,-121.75,37.8"
#    http = httplib2.Http()
#    http.add_credentials("firebrowse","111222")

#    d = Downloader("stream.twitter.com")
#    stuff = Downloader.get("/1/statuses/filter.json?locations=-122.75,36.8,-121.75,37.8")
#    print stuff

    f = os.popen("curl -s http://stream.twitter.com/1/statuses/filter.json?locations=-122.75,36.8,-121.75,37.8 -ufirebrowse:111222")
    print """Content-type: text/json

"""
    print f.readline()
    sys.exit(0)

#    try:
#        r, c = http.request(url)
#    except httplib2.ServerNotFoundError:
#        print "Problem with url [" + url + "]"
#        sys.exit(1)
#    print c

if __name__ == '__main__':
    main()
