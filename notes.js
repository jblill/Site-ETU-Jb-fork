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
  for (let i = 1; i <= 6; i++) {
    let note = parseFloat(document.getElementById('V'+(number-1)).value);
    if (note >= 0 || note <= 20 || Number.isNaN) {
      for (let j = number; j < 1700; j += 100) {
        if ((!isNaN(parseFloat(document.getElementById('C'+j).textContent))) && (!Number.isNaN(note)))
          document.getElementById('N'+(j-1)).value = (note/20) * parseFloat(document.getElementById('C'+j).textContent);
        else document.getElementById('N'+(j-1)).value = null;
      }
    }
    else alert('Notes invalides');
    number += 1;
  }
  for (let i = 101; i <= 112; i++) {
    for (let j = number; j < 1700; j += 100) {
      if ((!isNaN(parseFloat(document.getElementById('C'+j).textContent))) && (!Number.isNaN(parseFloat(document.getElementById('V'+(number-1)).value))))
        document.getElementById('N'+(j-1)).value = ((parseFloat(document.getElementById('V'+(number-1)).value))/20) * parseFloat(document.getElementById('C'+j).textContent);
      else document.getElementById('N'+(j-1)).value = null;
    }
    number += 1;
  }
  if ((!isNaN(parseFloat(document.getElementById('C1120').textContent))) && (!Number.isNaN(parseFloat(document.getElementById('V1120').value))))
    document.getElementById('N1120').value = ((parseFloat(document.getElementById('V1120').value))/20) * parseFloat(document.getElementById('C1120').textContent);  
  else document.getElementById('N1120').value = null;
  number += 1;
}

calculCoeff();



// Fonction pour sauvegarder les notes
async function saveNotes() {
  const user = (await client.auth.getUser()).data.user;
  if (!user) {
    alert('Pas connecté.');
    return;
  }
  for (let i = 1; i <= 6; i++) {
    const sValue = parseFloat(document.getElementById('s10'+i).value);
    const { data, error } = await client
    .from('notes_s1')
    .upsert([
      {
        id: user.id,
        [`s10${i}`]: sValue
      }
    ]);
  }
  for (let i = 101; i <= 112; i++) {
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
  const r1l1Value = parseFloat(document.getElementById('r1l1').value);
  const { data, error } = await client
    .from('notes_s1')
    .upsert([
      {
        id: user.id,
        r1l1: r1l1Value
      }
    ]);

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
}