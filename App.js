// Importando os módulos necessários
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert} from 'react-native';
import axios from 'axios';


// Definindo a URL da API
const API_URL = 'http://172.16.210.59:3000/users'; //ip máquina


// Criando um componente para renderizar cada item da lista de usuários
const UserItem = ({ user, onDelete, onEdit }) => {
  return (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{user.Nome}</Text>
      <Text style={styles.userAge}>{user.idade}</Text>
      <View style={styles.userActions}>
        <Button title="Editar" onPress={() => onEdit(user)} />
        <Button title="Excluir" onPress={() => onDelete(user.id)} />
      </View>
    </View>
  );
};

// Criando um componente para o formulário de cadastro e edição de usuários
const UserForm = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState(user ? user.nome : '');
  const [age, setAge] = useState(user ? user.idade : '');

  const handleSubmit = () => {
    if (user) {
      // Atualizando usuário já existente
      axios.put(`${API_URL}/${user.id}`, { nome: name, idade: age })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    } else {
      // Criando novo usuário
      axios.post(API_URL, { nome: name, idade: age })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    }
  };

  return (
    <View style={styles.userForm}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <View style={styles.formActions}>
        <Button title="Salvar" onPress={handleSubmit} />
        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </View>
  );
};


// Criando componente para a tela principal da aplicação
const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Buscando os usuários da API quando o componente é montado
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    // Buscando os usuários da API e atualizando o estado
    axios.get(API_URL)
      .then((response) => setUsers(response.data))
      .catch((error) => alert(error.message));
  };


    //Excluindo um usuário da API e atualizando o estado

  const handleDeleteUser = (id) => {
  
      Alert.alert('Alerta para apagar', 'Deseja excluir o arquivo permanentemente?',
       [
        {
          text: 'Cancelar',
          onPress: () => console.log('Exclusão cancelada'),
          style: 'cancel',
        },
        {
          text: 'Excluir', 
          onPress: () => {
            axios.delete(`${API_URL}/${id}`)
        .then(() => { fetchUsers(); })

        .catch((error) => { Alert.alert("Erro", error.message);
  });
}
}
      ],
  { cancelable: false }
);
    };
        

  const handleEditUser = (user) => {
    // Selecionando um usuário para editar e mostrar o formulário
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleSaveUser = () => {
    // Escondendo o formulário e atualizando os usuários
    setShowForm(false);
    fetchUsers();
  };

  const handleCancelUser = () => {
    // Escondendo o formulário e limpando o usuário selecionado
    setShowForm(false);
    setSelectedUser(null);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD API com React Native</Text>
      {showForm ? (
        // Mostrando o formulário se o estado showForm for verdadeiro
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={handleCancelUser}
        />
      ) : (
        // Mostrando a lista de usuários se o estado showForm for falso
        <>
           <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <UserItem
                user={item}
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
              />
            )}
          />
          <Button title="Adicionar usuário" onPress={() => setShowForm(true)} />          
        </>
      )}
    </View>
  );
};

export default App;//tive que colocar essa linha


// Definindo os estilos dos componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  userName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userAge: {
    flex: 1,
    fontSize: 18,
    textAlign: 'right',
  },
  userActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  userForm: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
 
});