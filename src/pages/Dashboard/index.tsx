import React, {useState,useEffect, FormEvent} from 'react';
import {FiChevronRight} from 'react-icons/fi';
import {Link } from 'react-router-dom';
import api from '../../service/api';

import logoImage from '../../assets/github-logo.svg';
import {Title,Form,Repositories,Error} from './styles';

interface Repository{
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

 const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storagedRepositories){
            return JSON.parse(storagedRepositories);
        }else{
            return [];
        }
        
    });

    

    useEffect(()=> {
        localStorage.setItem('@GithubExplorer:repositories',JSON.stringify(repositories));
    });

    async function handleAddRepository(event: FormEvent<HTMLFormElement>):Promise<void>{
        event.preventDefault();

        if(!newRepo){
            setInputError('Digite o user/repo do repositório');
            return;
        }
        try{
            const response = await api.get(`repos/${newRepo}`);
            console.log(response.data);
            const repository = response.data;
            setRepositories([...repositories, repository]); 
            setNewRepo('');  
            setInputError('');
        }catch(err){
            setInputError('Erro na busca por esse repositório');
        }     
    }


    return (
        <>
            <img src={logoImage} alt="Github Explorer"/>
            <Title>Explore repositórios no GitHub.</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input 
                value={newRepo}
                onChange={(e) => setNewRepo(e.target.value)}
                placeholder="Digite o nome do repositório: user/repo"/>
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}
            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight/>
                    </Link>
                ))}

            </Repositories>
        </>
    );
}
export default Dashboard;