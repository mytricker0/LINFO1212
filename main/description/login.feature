#language : fr

Fonctionnalité: indentification d'un utilisateur
    Pour avoir accès aux services du système il faut se connecter sur son compte existant

Scenario: identification acceptée

Étant donné un nom d'utilisateur connu et un mot de passe correct
Lorsque l'utilisateur soumet ces informations
Alors l'utilisateur est connecté sur son compte

Scenario: identification refusée

Étant donné un nom d'utilisateur inconnu et/ou un mot de passe incorrect
Lorsque l'utilisateur soumet ces informations
Alors l'utilisateur est invité à soumettre d'autres informations