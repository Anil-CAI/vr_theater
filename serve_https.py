import http.server
import ssl
import os

def run(server_class=http.server.HTTPServer, handler_class=http.server.SimpleHTTPRequestHandler):
    port = 8000
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    
    # Check if certificates exist
    if not os.path.exists('cert.pem') or not os.path.exists('key.pem'):
        print("\n" + "="*50)
        print("Error: cert.pem or key.pem not found in the current directory.")
        print("Please generate them using the following command:")
        print("openssl req -new -x509 -keyout key.pem -out cert.pem -days 365 -nodes")
        print("="*50 + "\n")
        return

    # Create SSL context
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile='cert.pem', keyfile='key.pem')
    
    # Wrap the socket
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    
    print(f"\nServing HTTPS at https://localhost:{port}")
    print("Press Ctrl+C to stop the server.\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.server_close()

if __name__ == '__main__':
    run()
