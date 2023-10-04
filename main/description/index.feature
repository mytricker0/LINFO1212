#language : fr

Fonctionnalité: entrée d'une adresse
    pour pouvoir signaler un incident, il faut entrer une adresse dans la barre de recherche d'adresse

Scenario: adresse acceptée

Étant donné un utilisateur connecté et une adresse valable en entrée
Lorsque l'utilisateur soumet ces données
Alors l'utilisateur est dirigé vers une page pour détailler l'incident

Scenario: redirection

Étant donné un utilisateur non connecté
Lorsque l'utilisateur soumet des données 
Alors l'utilisateur est redirigé vers la page de login

Scenario: adresse refusée

Étant donné un utilisateur connecté et une adresse non valable en entrée
Lorsque l'utilisateur soumet ces données 
Alors l'utilisateur est invité à réintroduire une nouvelle adresse