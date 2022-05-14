

export const pickRandomEmoji = ():string => {
  const emojis = [
    "🐶","🐺","🐱","🐭","🐹","🐰","🐸","🐯","🐨","🐻","🐷"
    ,"🐽","🐮","🐗","🐵","🐒","🐴","🐑","🐘","🐼","🐧","🐦"
    ,"🐤","🐥","🐣","🐔","🐍","🐢","🐛","🐝","🐜","🐞","🐌"
    ,"🐙","🐚","🐠","🐟","🐬","🐳","🐋","🐄","🐏","🐀","🐃"
    ,"🐅","🐇","🐉","🐎","🐐","🐓","🐕","🐖","🐁","🐂","🐲"
    ,"🐡","🐊","🐫","🐪","🐆","🐈","🐩","🐾","💐","🌸","🌷"
    ,"🍀","🌹","🌻","🌺","🍁","🍃","🍂","🌿","🌾","🍄","🌵"
    ,"🌴","🌲","🌳","🌰","🌱","🌼","🌐","🌞","🌝","🌚","🌑"
    ,"🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌜","🌛","🌙","🌍"
    ,"🌎","🌏","🌋","🌌","🌠","⛅","⛄","🌀","🌁","🌈","🌊"]

  return emojis[Math.floor(Math.random() * emojis.length)];
}

export const randomString = () => {
  const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const N=16
  return Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('');
}