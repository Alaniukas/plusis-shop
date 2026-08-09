# Plušis — el. parduotuvė

Projektas: **C:\Users\37062\Projects\minkutis-shop**

## Kaip paleisti (Windows)

1. Cursor: **File → Open Folder** → pasirink `C:\Users\37062\Projects\minkutis-shop`
2. Terminal (PowerShell) **tame folderyje**:

```powershell
cd C:\Users\37062\Projects\minkutis-shop
npm install
npm run dev
```

3. Atidaryk: http://localhost:3000 (arba 3001 jei 3000 užimtas)

## Jei npm neveikia

- Patikrink: `node --version` (reikia 18+)
- Būk **projekto folderyje** — ten kur yra `package.json`
- Jei klaida "package.json not found" — esi neteisingame folderyje

## Demo režimas

Veikia be `.env`. Užsakymai → `data/demo-orders.json`

## Logo

`public/logo.png` — header ir favicon