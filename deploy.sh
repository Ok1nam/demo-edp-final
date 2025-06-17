#!/bin/bash

echo "📦 1. Ajout de tous les fichiers..."
git add -A

echo "📝 2. Commit des changements..."
read -p "Message du commit : " message
git commit -m "$message"

echo "🚀 3. Push vers GitHub..."
git push origin main

echo "🌐 4. Déploiement vers GitHub Pages..."
npm run deploy

echo "✅ Déploiement terminé avec succès !"
