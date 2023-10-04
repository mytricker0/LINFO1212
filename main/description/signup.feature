#language : fr

Fonctionnalité: création d'un compte
    Pour avoir accès aux services du système il faut avoir un compte et s'être authentifié

Scenario: création d'un compte avec succès

Étant donné 
    un username et un email inconnu du système
    un mot de passe recopié avec succès
Lorsque l'utilisateur soumet ces informations
Alors un compte est crée et l'utilisateur est authentifié

Scenario: création d'un compte sans succès

Étant donné 
    un username ou email préexistant
    et/ou un mot de passe recopié incorrectement
Lorsque l'utilisateur soumet ces informations
Alors aucun compte n'est crée et l'utilisateur est invité à introduire d'autres informations