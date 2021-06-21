
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


function resultCall1() {
    const url = 'games.json'
    fetch(url)
        .then(resp => resp.json())
        .then(res => {
            console.log(res.types)
            res.types.map((item, index) => {
                let buttonItem = c('.models .loto-box').cloneNode(true);

                buttonItem.setAttribute('data-key', index);
                //preencher as informações do botao
                buttonItem.querySelector('.lotoText').innerHTML = item.type
                c('.button-area').append(buttonItem);
                buttonItem.querySelector('button').addEventListener('click', (e) => {
                   
                    let key = e.target.closest('.loto-box').getAttribute('data-key');

                    console.log(item[key])
                    
                    c('.number-body').style.display = 'flex';
                    console.log(item.description)
                    c('.descricao span').innerHTML = item.description;
                    c('.apostaName span span').innerHTML = item.type;



                    arr = []
                    for (let i = 1; i <= item.range; i++) {
                   
                        arr.push(i)
                       
                    }
                 
                    arr.map((item, index) => {
                        let buttonNumber = c('.numbers').cloneNode(true);
                      
                        console.log(item)
                        c('.numbers a').innerHTML = item;
                        buttonNumber.querySelector('a').addEventListener('click', (e) => {
                            e.preventDefault();
                            console.log(item)
                        })

                        c('.containerNumber').append(buttonNumber);
                    })






                })

            })

        })

                    
      

}

resultCall1()


