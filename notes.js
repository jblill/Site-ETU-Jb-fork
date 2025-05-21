const supabaseUrl = 'https://vzhudrkctpwmuvktcxjz.supabase.co'; // Ton URL Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aHVkcmtjdHB3bXV2a3RjeGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjU0MzUsImV4cCI6MjA1OTk0MTQzNX0.1kN-TxVwJw_lhtTcwn7XeFLrqHZZ9TzCEOjHS_Ip-G0'; // Ta clé "anon"
const client = supabase.createClient(supabaseUrl, supabaseKey, { auth: { persistSession: true, autoRefreshToken: true }});


async function checkUser() {
    const { data, error } = await client.auth.getUser();
  
    if (error || !data.user) {
      console.error('Pas connecté ❌', error?.message);
      alert('Tu dois être connecté pour utiliser cette page.');
      window.location.href = 'test.html';
    } else {
      console.log('Connecté ✅', data.user.email);
    }
  }
  
  checkUser();
  


async function calculCoeff() {
  let number = 1102; 
  for (let number = 1102; number <= 1120; number++) {
    let note = parseFloat(document.getElementById('V'+(number-1)).value);
    if ((note >= 0 && note <= 20) || Number.isNaN(note)) {
      for (let j = number; j < 1700; j += 100) {
        if ((!isNaN(parseFloat(document.getElementById('C'+j).textContent))) && (!Number.isNaN(note)))
          document.getElementById('N'+(j-1)).value = (note/20) * parseFloat(document.getElementById('C'+j).textContent);
        else document.getElementById('N'+(j-1)).value = null;
      }
    }
    else alert('Notes invalides');
  }
}


async function total() {
  for (let i = 11; i <= 16; i++) {
    let totalVal = 0;
    for (let j = 1; j <= 20; j++) {
      let id = 'N' + i + (j < 10 ? '0' : '') + j;
      if (!isNaN(parseFloat(document.getElementById(id).value))) 
        totalVal += parseFloat(document.getElementById(id).value);
    }
    document.getElementById('N'+i+'21').value = totalVal;
  }
}

async function total2() {
  for (let i = 11; i <= 16; i++) {
    if (!isNaN(parseFloat(document.getElementById('N'+i+'21').value))) 
      document.getElementById('N'+i+'22').value = parseFloat(document.getElementById('C'+i+'21').textContent) - parseFloat(document.getElementById('N'+i+'21').value);
  }
}

async function total3() {
  for (let i = 11; i <= 16; i++) {
    if (!isNaN(parseFloat(document.getElementById('N'+i+'21').value))) 
      document.getElementById('N'+i+'23').value = parseFloat(document.getElementById('N'+i+'21').value) / parseFloat(document.getElementById('C'+i+'21').textContent) * 20;  }
}

async function total4() {
  for (let i = 11; i <= 16; i++) {
    let totalVal = 0;
    for (let j = 1; j <= 20; j++) {
      let id = 'N' + i + (j < 10 ? '0' : '') + j;
      let id2 = 'C' + i + ((j+1) < 10 ? '0' : '') + (j+1);
      if (!isNaN(parseFloat(document.getElementById(id).value))) {
        totalVal += parseFloat(document.getElementById(id2).textContent);
        //console.log(parseFloat(document.getElementById(id2).textContent));
        }
    }
    //console.log(totalVal);
    document.getElementById('N'+i+'24').value = totalVal;
  }
}

async function total5() {
  for (let i = 11; i <= 16; i++) {
    if (!isNaN(parseFloat(document.getElementById('N'+i+'24').value))) 
      document.getElementById('N'+i+'25').value = parseFloat(document.getElementById('C'+i+'21').textContent) - parseFloat(document.getElementById('N'+i+'24').value);
  }
}

async function total6() {
  for (let i = 11; i <= 16; i++) {
    if (!isNaN(parseFloat(document.getElementById('N'+i+'21').value))) 
      document.getElementById('N'+i+'26').value = ((document.getElementById('N'+i+'21').value) / (parseFloat(document.getElementById('C'+i+'21').textContent) - document.getElementById('N'+i+'25').value) * 20);  
      //console.log((document.getElementById('N'+i+'21').value));
  }
}




calculCoeff();
total();
total2();
total3();

async function rrrrr(params) {
  calculCoeff();
  total();
  total2();
  total3();
  total4();
  total5();
  total6();

}



// Fonction pour sauvegarder les notes
async function saveNotes() {
  const user = (await client.auth.getUser()).data.user;
  if (!user) {
    alert('Pas connecté.');
    return;
  }
  for (let i = 101; i <= 119; i++) {
    const sValue = parseFloat(document.getElementById('r'+i).value);
    const { data, error } = await client
    .from('notes_s1')
    .upsert([
      {
        id: user.id,
        [`r${i}`]: sValue
      }
    ]);
  }

  if (error) {
    console.error('Erreur enregistrement:', error);
    alert('Erreur : ' + error.message);
  } else {
    console.log('Succès:', data);
    alert('Notes enregistrées !');
  }
}

// Fonction pour charger les notes
async function loadNotes() {
  const user = (await client.auth.getUser()).data.user;
  if (!user) {
    alert('Pas connecté.');
    return;
  }

  const { data, error } = await client
    .from('notes_s1')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Erreur chargement:', error);
    alert('Erreur : ' + error.message);
  } else {
    console.log('Données:', data);
    document.getElementById('result').innerText = JSON.stringify(data, null, 2);
  }
  if (isNaN(parseFloat(document.getElementById('N1201').value))) { document.getElementById('N1106').value = "r"; }
  else { document.getElementById('N1106').value = parseFloat(document.getElementById('N1201').value); }
  document.getElementById('N1105').value = "155";
  let ryriyr = parseFloat(document.getElementById('C1102').textContent);
  console.log(ryriyr);
  total1();
}
