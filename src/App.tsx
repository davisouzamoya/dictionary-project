import {Search,Volume2Icon} from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Phonetic {
  text: string;
  audio?: string;
}

interface Error { 
  message: string
  resolution: string
  title: string
}

interface Definitions {
  definition: string;
  synonyms?: string[];    
  antonyms?: string[];
  example?: string;
  
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definitions[];
  synonyms?: Array<string>;    
  antonyms?: Array<string>;
  
}

interface WordEntry {
  word: string;
  title?: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

function App() {
  const [word, setWord] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(false); 
  const [meanings, setMeanings] = useState<Meaning[]>([]);
  const [synonyms, setSynonyms] = useState<Array<string>| undefined>([]);
  const [search,setSearch] = useState(() =>{
    const url = new URL(window.location.toString())

    if(url.searchParams.has('seach')){
        return url.searchParams.get('seach') ?? ''
    }

    return ''
  })
  
  useEffect(() => {
    const fetchData = async () => {
      if (!search) return;
  
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`);
        const data:Array<WordEntry>  | Error= await response.json();
  
        if ('title' in data) {
          throw new Error(data.title); 
        }
  
        // Process the data normally
        setWord(data[0].word);
        
        setPhonetic(data[0].phonetic);
        setMeanings(data[0].meanings);
        setSynonyms(data[0].meanings[0]?.synonyms);
        
        
        const audio = data[0].phonetics.find((p:any) => p.audio !== '');
        if (audio && audio.audio) {
          setAudioUrl(audio.audio);
        }
      } catch {
        toast.error("Word not found", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
          });
      }
    };
  
    fetchData();
    setWordUrl()
  }, [searchTrigger]);

  function onSeachInputChange(event: ChangeEvent<HTMLInputElement>){
    const valueInput = event.target.value
    setSearch(valueInput)
  }
  
  function onSeachWord(){
    if(!search){
      alert('Please fill in the field')
      return 
    } 
    
    setSearchTrigger(!searchTrigger); 

  }
  
  function onSeach(word:string){    
    setSearch(word)
    setSearchTrigger(!searchTrigger); 
  }

  function setWordUrl(){
    const url = new URL(window.location.toString())

    url.searchParams.set('seach',word)

    window.history.pushState({},"",url)
  }

  function onListent(){
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().then(() => {
        console.log("Audio playing successfully");
      }).catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Error playing audio:", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
          });
      });
    } else {
      alert('No audio available for this word.');
    }
  }

  return (
    
    <div className='flex flex-col items-center mt-5 mb-10 bg-white/10 rounded-lg max-w-[1216px]  min-h-screen mx-auto py-5'>
      <ToastContainer />
      <div className='px-3 w-72 py-1.5 border rounded-lg text-sm flex items-center gap-3'>  
        <input 
            value={search}
            onChange={onSeachInputChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSeachWord();
              }
            }}
            className='bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0' 
            placeholder="Seach Word...."/>
        <Search size={20} onClick={onSeachWord} className='cursor-pointer hover:text-blue-500'/>  
      </div>
      
      
        

        {  meanings.length > 0 ?
          <div className='w-full px-2.5' >
            <div className='flex items-center'>
              <h1 className='text-[40px] font-bold mr-2'>
                {word}
              </h1>
              {phonetic && (
                <span className='mr-2'>
                  [ {phonetic} ]
                </span>
              )}
                {audioUrl && (
                <Volume2Icon 
                  className='cursor-pointer transition-transform duration-200 transform hover:scale-110 hover:text-blue-500'
                  size={20} 
                  onClick={onListent}
                />
                )}
              

            </div>

            {synonyms && synonyms?.length > 0 && (
              <div className='items-center mb-3'>
                <p className='font-bold mr-0.5'>
                  See synonyms for:
                </p>
                {synonyms?.map((value,index) =>(
                    <span 
                      key={index}
                      className='cursor-pointer hover:underline ml-1'
                      onClick={() => {onSeach(value)}}
                    >
                      {value}
                      { index < (synonyms?.length ?? 0) - 1 
                        ? ',' 
                        : ''
                      }
                    </span>
                  ))
                }
              </div>
            )}

          <hr className='mt-8'/> 
          
            {meanings.map((value,index) => (
              <>
                <div className='mb-4 mt-4 ml-1' >
                  <span className='italic font-bold'>{value.partOfSpeech}</span>
                </div>

                <div className='ml-2.5'  key={index}>
                  {value.definitions.map((value,index) => (
                    <>
                    <ul>
                      <li className='font-semibold text-white '>{`${index+1}. `}{value.definition}</li> 
                    
                    {value.synonyms && value.synonyms.length > 0 && (
                      <>
                        {value.synonyms?.map(val =>(
                          <>
                            <li>{val}</li>
                          </>
                        ))}
                      </>
                    )}
                    
                    </ul>

                    {value.example && (
                      <span className='italic text-sm opacity-85 ml-3'>
                        Ex.: {value.example}
                      </span>
                    )}
                    
                    </>
                    ))}
                </div>


                { value.antonyms && value.antonyms.length > 0 && (
                  <div className='flex flex-col mt-4 ml-3'>
                    <span className='italic font-bold'>Antonyms</span>
                    <div className='ml-3 space-x-1'>
                      {value.antonyms?.map((antonyms,index) => (
                        <span
                          key={index}
                          className='cursor-pointer hover:underline'
                          onClick={() => {onSeach(antonyms)}}
                        >
                          {antonyms}
                          { index < (value.antonyms?.length ?? 0) - 1 
                            ? ',' 
                            : ''
                          }
                          </span>
                      ))}
                    
                    </div>
                  </div>
                )}
                
                
              </>
            ))}
          </div>
        :
        <div className='flex justify-center items-center h-screen'>
            <h1 className='text-[40px] font-bold mr-2'>Find Words...</h1>
          </div>
        }
    </div>
  );
}

export default App;
