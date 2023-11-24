#language : fr

Fonctionnalité: suppression / modifications des incidents signalés par l'utilisateur
    Lorsqu'un utilisateur est connecté à son compte, il a accès à sa page de profil.

Scenario: modification d'un incident
    Etant donné un utilisateur connecté ayant signalé un incident
    Lorsque l'utilisateur souhaite modifier un incident
    Alors il est invité à changer les 3 données prises en compte et à confirmer les modifications
    Quand ces modifications sont confirmées
    Alors l'incident est modifié dans la base de données

Scenario: suppression d'un incident
    Etant donné un utilisateur connecté ayant signalé un incident
    Lorsque l'utilisateur souhaite supprimer un incident
    Alors il est invité à confirmer la suppression
    Quand la suppression est confirmée
    Alors l'incident est supprimé de la base de données