npm run build
ssh root@45.32.78.106 "rm -rf ~/workplace/youqu/channel/http/static/*"
scp -vrC ./build/static root@45.32.78.106:/root/workplace/youqu/channel/http/
scp ./build/asset-manifest.json root@45.32.78.106:/root/workplace/youqu/channel/http/static/manifest.json
scp ./build/index.html root@45.32.78.106:/root/workplace/youqu/channel/http/templates/