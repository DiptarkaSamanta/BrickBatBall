# launch.py - Instant resilient launcher for Bricks of Egypt & Jardinains!
import http.server
import socketserver
import webbrowser
import socket
import os
import sys

def find_free_port():
    for port in [8000, 8080, 8888, 3000, 5000]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = find_free_port()
    url = f"http://localhost:{port}/index.html"

    print("==================================================================")
    print("      BRICKS OF EGYPT & JARDINAINS! - INSTANT ARCADE PLAY")
    print("==================================================================")
    print(f"Starting local server at {url} ...")
    print("Opening game in your default browser...")
    print("Keep this window open while playing. Close it anytime to stop.")
    print("==================================================================")

    webbrowser.open(url)

    handler = http.server.SimpleHTTPRequestHandler
    handler.log_message = lambda self, format, *args: None

    with socketserver.TCPServer(("", port), handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Thanks for playing!")

if __name__ == '__main__':
    main()
