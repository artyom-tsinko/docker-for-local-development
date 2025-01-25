import os
from http.server import BaseHTTPRequestHandler, HTTPServer

class EnvHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        env_vars = '\n'.join([f'{key}: {value}' for key, value in os.environ.items()])
        self.wfile.write(env_vars.encode('utf-8'))

def run(server_class=HTTPServer, handler_class=EnvHandler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting httpd server on port {port}...')
    httpd.serve_forever()

if __name__ == "__main__":
    run()
