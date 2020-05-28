# Tetris.js Utvärdering

Detta var ett projekt som jag kom på i sista sekunden. Jag ville göra ett spel med bara javascript, html och css men visste först inte vilket. I början trodde jag att tetris inte skulle vara tillräckligt avancerat för ett slutprojekt. Men det hade jag HELT fel om. Detta projekt krävde stora färdigheter i programmering, design och matte, vilket också ledde till att jag lärde mig mycket från det.

# Rotationer
Den första stora utmaningen med tetris var hur man skulle rotera alla sorters bitar på ett bra sätt. Jag skulle kunna göra en array för varje block i varje rotation i varje bit. Men det skulle ta MASSOR ut av kod att göra och skulle vara mer förvirrande än effektivt. Jag läste på internet om en metod där man ser på bitarna som 16-bitars integers. Och använde sig av hexadecimaler för att räkna ut bitarnas positioner. Här är ett exempel: ![enter image desfffcription here](https://codeincomplete.com/articles/javascript-tetris/bits.png) 
Precis som binära tal så räknar man ut vilka rutor som ska vara ifyllda genom att räkna ihop dem med hur många åttor, fyror, tvåor och ettor som finns. Den slår man ihop de fyra raderna till en 16-bitars interger exempe: "0x4460", som blir standard rotationen på L biten i tetris. Btw, jag lärde mig också att bitarna kallades "tetrominos". Vilket är det riktiga matematiska namnet för figurer som består av 4 kvadrater.

# Kollisioner
Detta är alltid den svåraste delen av spel programmering och den delen jag behövde felsöka mest. Här förekommer 90% av alla spelets buggar, och i detta projektet fanns det flera i början. Jag hade problem med att bitar kunde rotera in i andra bitar. Men efter mycket tänkade så kom jag tillslut fram till en logik som bara skulle göra det möjligt för bitar att rotera om de inte skulle kollidera med andra bitar. Det var också i den här delen som jag såg till att bitarna stanade på botten.

# Buggar
Jag har jobbat riktigt hårt för att fixa så många buggar jag kan. Jag började detta projektet på programmerings lektionen torsdagen den 28 maj. Och jobbade där efter nostop i 13 timmar framms till nu, (klockan är ungefär 1 på natten). Den ända buggen jag lyckats hitta som finns kvar är att när man får tetris så finns en bit kvar på skärmen i några sekunder. Men jag känner ändå att spelet i sin helhelt är tillräckligt bra för att lämnas in.

# Prestanda/Stabilihet
Spelet presterar väldigt bra och är väldigt stabilt. Anledningen till detta är de fiffiga sätten jag har sparat på ram mine. Ett exempel på detta var 16-bitars rotationerna jag förklarade tidigare i texten. Men också att jag skrev hela spelet i helt vanlig javascript. Inga bibliotek eller tunga hjälpmedel som bara tar plats. Allt minne spelet tar upp har jag i princip allokerat själv.

# Förbättringar
Detta spel kan förbättras på många olika sätt. Jag kände att det var tillräckligt bra för att lämna in då imorgon är inlämningsdagen. Men vad jag skulle vilja göra i framtiden är till exempel några egna texturer till bitarna. Just nu är det bara vanliga färger genererade av html. Jag skulle nog också göra lita coola effekter, och lägga till den fina tetris låten i bakgrunden. Jag kanske till och med försöker göra en mobil version, vem vet? Det vet bara framtiden.

# Sammanfattning 
Detta var ett såkallat spurt-projekt, som bestått av mycket koffein och en svettig panna. Men när man väl blir klar med sånna projekt så blir det så fantastiskt på något sätt. Anledningen att webbutveckling/programmering är så kul är ju när man får se det fantastiska resultatet. Och att kunna spela ett färdigt spel som du HELT själv har gjort från grunden, det är riktigt spännande. Detta blev då mitt avslut på webbutveckling 1 kursen på gymnasiet. Och det har verkligen kul, ser redan fram emot de spännande projekten jag kommer jobba med i kommaned kurser. Testa gärna spelet på http://webb19.ntig.tech/Jacob/tetris/ . Om du vill kolla på koden så finns den här på github sidan, självklart öppen källkod. All kod är kommenterad och använder sig av relevanta variabler för de olika situationerna. Tack! Tack!


***/ Jacob Sundh***


