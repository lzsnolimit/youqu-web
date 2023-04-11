npm run build
scp -vrC ./build/static root@45.32.78.106:/root/workplace/youqu/channel/http/
scp ./build/asset-manifest.json root@45.32.78.106:/root/workplace/youqu/channel/http/static/asset-manifest.json
scp ./build/index.html root@45.32.78.106:/root/workplace/youqu/channel/http/templates/