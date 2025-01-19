import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Login';
import Cadastro from './Cadastro';
import Menu from './Menu';
import Nivel from './Nivel';
import Historico from './Historico';
import Configuracoes from './Configuracoes';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Nivel" component={Nivel} />
        <Stack.Screen name="Historico" component={Historico} />
        <Stack.Screen name="Configuracoes" component={Configuracoes} />
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
};

export default App;
