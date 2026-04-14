// custom the values
const bookContainer = document.getElementById('bookContainer');
const bookCover = document.getElementById('coverPage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const copyBtn = document.getElementById('copyBtn');
const rightText = document.getElementById('rightText');
const author = document.getElementById('author');
const book = document.getElementById('book');


// make sure the book is  closed at the beginning.
let isBookOpen = false;

// setting of  the memory
let quoteHistory = [];
let currentIndex = -1;


// asynchronous
async function fetchQuote(){
    try {
        const response = await fetch('https://v1.hitokoto.cn/');
        return await response.json();
    }
    catch(e) {
        return {
            hitokoto:"something is wrong, please try it again",from:"internet"
        };
    }
}

// the fucntion of next page

nextBtn.addEventListener('click',async()=>{
    nextBtn.disabled = true;
    prevBtn.disabled = true;
// Prevent the function from excuting  when the book is closed.
let data;

// determine whether to get new data or read historical data.
if(currentIndex < quoteHistory.length - 1){
    currentIndex++;
    data = quoteHistory[ currentIndex];

}else{
    if(isBookOpen)rightText.innerText = 'processing...' ;
    data = await fetchQuote();
    quoteHistory.push(data);
    // reserve the data.
    currentIndex++;
}

if(!isBookOpen){
    bookContainer.classList.add('open');
    bookCover.classList.add('flipped');

    setTimeout(() => {
        rightText.innerText = data.hitokoto;
        author.innerText = `—— ${data.from}`;
        isBookOpen = true;
        nextBtn.disabled = false;
        prevBtn.disabled = false;

    }, 600);
}else{
    const newPage= document.createElement('div');
    newPage.className = 'page-dynamic';
    newPage.innerHTML = '<div class="page_front"></div><div class="page_back"></div>';
    // create new pages for the new sentences


    // the new page always on the top layer
    newPage.style.zIndex = quoteHistory.length;
    book.appendChild(newPage);
    // the newly created DOM node,as the last child element.


    setTimeout(() => newPage.classList.add('flipped'), 60);
      setTimeout(() => {
            rightText.innerText = data.hitokoto;
            author.innerText = `—— ${data.from}`;
            nextBtn.disabled = false;
            prevBtn.disabled = false;
        }, 600);

        // the first setTimeout() is for giving times to render the  newpage, 
        // the second waits for the animation's halfway point to swap the text.
}     });




// preverous page
prevBtn.addEventListener('click',()=>{

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    if(currentIndex === 0){
        bookCover.classList.remove('flipped');
        bookContainer.classList.remove('open');

         setTimeout(() => {
            rightText.innerText = "processing...";
            author.innerText = "";
            isBookOpen = false;
            currentIndex = -1; 
            nextBtn.disabled = false;
            // prevBtn keeping disabled.
        }, 600);
        return;
    }

    // back to the last one of historical page
      const flippedPages = document.querySelectorAll('.page-dynamic.flipped');
      const lastFlippedPage = flippedPages[flippedPages.length - 1];
  if (lastFlippedPage) {
        lastFlippedPage.classList.remove('flipped');
        currentIndex--; 
        const prevData = quoteHistory[currentIndex];
        setTimeout(() => {
            rightText.innerText = prevData.hitokoto;
            author.innerText = `—— ${prevData.from}`;
            setTimeout(() => lastFlippedPage.remove(), 600);
            
            nextBtn.disabled = false;
            prevBtn.disabled = false;
        }, 600);
    }

})

// copy button
copyBtn.addEventListener('click', async () => {
    const textToCopy = `${rightText.innerText} ${author.innerText}`;
    if (!isBookOpen || textToCopy.includes("processing")) {
        alert("please to get the sentence firstly");
        return;
    }
    try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'copy successfully';
        setTimeout(() => copyBtn.innerText = originalText, 2000);
    } catch (err) {
        alert('error');
    }
});