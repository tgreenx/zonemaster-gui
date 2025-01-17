import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const urls = [
  // Version info
  {
    url: 'https://zonemaster.net/api',
    body: {jsonrpc: '2.0', id: 1643203570632, method:'version_info', params: {}},
    method: 'POST',
    json: {jsonrpc: '2.0', id: 1643203570632, result: {zonemaster_engine: 'e2e-test', zonemaster_backend: 'e2e-test'}}
  },

  // Profile list in option
  {
    url: 'https://zonemaster.net/api',
    body: {jsonrpc: '2.0', id:1643203351479, method: 'profile_names', params: {}},
    method: 'POST',
    json: {jsonrpc: '2.0', id: 1643203351479, result: ["default"]}
  },

  // FR18 - Should display progress bar
  // FR26 - Should display progress bar
  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254767685, 'method': 'start_domain_test', 'params':
      {
        'language':'en', 'domain': 'progress.afNiC.Fr', 'profile': 'default',
        'nameservers': [], 'ds_info': []
      }
    },
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254767685, 'result': '2005cf23e9fb24b6'}
  },

  // FR19 - Should display progress bar when we add a NS name
  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254767685, 'method': 'start_domain_test', 'params':
      {
        'language':'en', 'domain': 'progress.afNiC.Fr', 'profile': 'default',
        'nameservers': [{"ns": "ns1.nic.fr"}], 'ds_info': []
      }
    },
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254767685, 'result': '2005cf23e9fb24b6'}
  },

  // FR19 - should NOT display progress bar when we add a NS ip
  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254767685, 'method': 'start_domain_test', 'params':
      {
        'language':'en', 'domain': 'progress.afNiC.Fr', 'profile': 'default',
        'nameservers': [{"ns":"", "ip": "192.134.4.1"}], 'ds_info': []
      }
    },
    method: 'POST',
    json: {
      "jsonrpc": "2.0",
      "error": {
        "message": "Invalid method parameter(s).",
        "code": "-32602",
        "data": [
          {
            "path": "/nameservers/0/ns",
            "message": "The domain name character(s) are not supported"
          }
        ]
      },
      "id": 1572254767685
    }
  },

  // FR20 - should display progress bar when we add a DS entry and launch a test
  {
    url: 'https://zonemaster.net/api',
    body:{'jsonrpc': '2.0', 'id': 1572277567967, 'method': 'start_domain_test', 'params':
      {
        'language':'en', 'domain': 'progress.afNiC.Fr', 'profile': 'default',
        'nameservers': [], 'ds_info': [{
          "keytag": 37610,
          "algorithm":8,
          "digtype":2,
          "digest":"d2681e301f632bd76544e6d5b6631a12d97b5479ff07cd24efecd19203c77db3"
        }]
      }
    },
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572277567967, 'result': '2005cf23e9fb24b6'}
  },

  // FR18 - Should display progress bar
  // FR19 - Should display progress bar when we add a NS name
  // FR20 - should display progress bar when we add a DS entry and launch a test
  // FR26 - Should display progress bar
  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254972236, 'method': 'test_progress', 'params': {'test_id': '2005cf23e9fb24b6'}},
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254972236, 'result': 50}
  },


  // FR21 - Should display summary
  // FR22 - Should display full messages
  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254767685, 'method': 'start_domain_test', 'params':
      {
        'language':'en', 'domain': 'results.afNiC.Fr', 'profile': 'default',
        'nameservers': [], 'ds_info': []
      }
    },
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254767685, 'result': '226f6d4f44ae3f80'}
  },

  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254767685, 'method': 'start_domain_test', 'params':
      {
        'language':'en', 'domain': 'empty-results.afNiC.Fr', 'profile': 'default',
        'nameservers': [], 'ds_info': []
      }
    },
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254767685, 'result': 'a0fbcbf6c5ff5842'}
  },

  // FR21 - Should display summary
  // FR22 - Should display full messages
  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254972236, 'method': 'test_progress', 'params': {'test_id': '226f6d4f44ae3f80'}},
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254972236, 'result': 100}
  },


  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254972236, 'method': 'test_progress', 'params': {'test_id': 'a0fbcbf6c5ff5842'}},
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254972236, 'result': 100}
  },


  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254972327, 'method': 'get_test_results', 'params': {'id': 'a0fbcbf6c5ff5842', 'language': 'en'}},
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254972327, 'result': {
        'params': {'profile' : 'default', 'priority': 10, 'ipv6': true, 'ipv4': true, 'client_id': 'Zonemaster GUI',
          'nameservers': [], 'ds_info': [], 'domain': 'empty-results.afNiC.Fr', 'queue': 0, 'client_version': '3.1.0'
        }, 'hash_id': 'a0fbcbf6c5ff5842', 'created_at': '2019-10-28T09:29:26Z', 'creation_time': '2019-10-28 09:29:26.288692', 'id': 49640, 'results':[]
      }
    }
  },


  // FR21 - Should display summary
  // FR22 - Should display full messages

  // FR23 - Should display previous tests
  // FR24 - Should display previous run link
  // FR25 - Should have an export button
  // FR25 - Should open a modal that contains four export possibilities
  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572254972327, 'method': 'get_test_results', 'params': {'id': '226f6d4f44ae3f80', 'language': 'en'}},
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572254972327, 'result': {
        'params': {'profile' : 'default', 'priority': 10, 'ipv6': true, 'ipv4': true, 'client_id': 'Zonemaster GUI',
          'nameservers': [], 'ds_info': [], 'domain': 'results.afNiC.Fr', 'queue': 0, 'client_version': '3.1.0'
        }, 'hash_id': '226f6d4f44ae3f80', 'created_at': '2019-10-28T09:29:26Z', 'creation_time': '2019-10-28 09:29:26.288692', 'id': 49640, 'results':
        [{"level":"INFO","message":"Utilisation de la version v3.0.3 du moteur Zonemaster.\n","module":"SYSTEM"},{"level":"ERROR","message":"Une zone parente 'fr' a pu être trouvée pour le nom de domaine testé.\n","module":"BASIC"},{"level":"INFO","message":"IPv4 est activé,  il est possible de réaliser une requête de type \"NS\" sur le serveur ns1.nic.fr/192.134.4.1.\n","module":"BASIC"},{"level":"INFO","message":"Une requête NS sur le serveur de noms ns1.nic.fr renvoie la liste de serveurs de noms suivants: ns1.nic.fr., ns2.nic.fr., ns3.nic.fr..\n","module":"BASIC"},{"level":"INFO","message":"IPv6 est activé,  il est possible de réaliser une requête de type \"NS\" sur le serveur ns1.nic.fr.\n","module":"BASIC"},{"level":"INFO","message":"Une requête NS sur le serveur de noms ns1.nic.fr renvoie la liste de serveurs de noms suivants: ns1.nic.fr., ns2.nic.fr., ns3.nic.fr..\n","module":"BASIC"},{"level":"INFO","message":"IPv4 est activé,  il est possible de réaliser une requête de type \"NS\" sur le serveur ns2.nic.fr/192.93.0.4.\n","module":"BASIC"},{"level":"INFO","message":"Une requête NS sur le serveur de noms ns2.nic.fr renvoie la liste de serveurs de noms suivants: ns1.nic.fr., ns2.nic.fr., ns3.nic.fr..\n","module":"BASIC"},{"level":"INFO","message":"IPv6 est activé,  il est possible de réaliser une requête de type \"NS\" sur le serveur ns2.nic.fr.\n","module":"BASIC"},{"level":"INFO","message":"Une requête NS sur le serveur de noms ns2.nic.fr renvoie la liste de serveurs de noms suivants: ns1.nic.fr., ns2.nic.fr., ns3.nic.fr..\n","module":"BASIC"},{"level":"INFO","message":"IPv4 est activé,  il est possible de réaliser une requête de type \"NS\" sur le serveur ns3.nic.fr/192.134.0.49.\n","module":"BASIC"},{"level":"INFO","message":"Une requête NS sur le serveur de noms ns3.nic.fr renvoie la liste de serveurs de noms suivants: ns1.nic.fr., ns2.nic.fr., ns3.nic.fr..\n","module":"BASIC"},{"level":"INFO","message":"IPv6 est activé,  il est possible de réaliser une requête de type \"NS\" sur le serveur ns3.nic.fr.\n","module":"BASIC"},{"level":"INFO","message":"Une requête NS sur le serveur de noms ns3.nic.fr renvoie la liste de serveurs de noms suivants: ns1.nic.fr., ns2.nic.fr., ns3.nic.fr..\n","module":"BASIC"},{"level":"INFO","message":"Un serveur de noms fonctionnel a été trouvé. Inutile de réaliser une requête de type \"A\" sur www.afNiC.Fr.\n","module":"BASIC"},{"level":"INFO","message":"Toutes les adresses IP des serveurs de noms sont dans l'espace d'adresses publiques routables.\n","module":"ADDRESS"},{"level":"INFO","message":"Les différentes adresses IP des serveurs de noms ont toutes un enregistrement \"PTR\" (reverse) associé dans le DNS.\n","module":"ADDRESS"},{"level":"INFO","message":"Tous les enregistrements PTR correspondent aux serveurs de noms.\n","module":"ADDRESS"},{"level":"INFO","message":"Le serveur de noms ns1.nic.fr/192.134.4.1 est accessible via UDP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns1.nic.fr/2001:67c:2218:2::4:1 est accessible via UDP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns2.nic.fr/192.93.0.4 est accessible via UDP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns2.nic.fr/2001:660:3005:1::1:2 est accessible via UDP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns3.nic.fr/192.134.0.49 est accessible via UDP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns3.nic.fr/2001:660:3006:1::1:1 est accessible via UDP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns1.nic.fr/192.134.4.1 est accessible via TCP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns1.nic.fr/2001:67c:2218:2::4:1 est accessible via TCP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns2.nic.fr/192.93.0.4 est accessible via TCP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns2.nic.fr/2001:660:3005:1::1:2 est accessible via TCP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns3.nic.fr/192.134.0.49 est accessible via TCP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le serveur de noms ns3.nic.fr/2001:660:3006:1::1:1 est accessible via TCP sur le port 53.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Les serveurs de noms ont des adresses IPv4 dans les AS suivants: 2486, 2485.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Les serveurs de noms ont des adresses IPv6 dans les AS suivants: 2486, 2485.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Les adresses IPv4 des serveurs faisant autorité se trouvent dans plusieurs AS.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Les adresses IPv6 des serveurs faisant autorité se trouvent dans plusieurs AS.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Les serveurs de noms pour le nom de domaine ne se trouvent pas tous dans le même AS.\n","module":"CONNECTIVITY"},{"level":"INFO","message":"Le numéro de série 2019102803 a été récupérée sur les serveurs suivants : ns1.nic.fr/192.134.4.1; ns1.nic.fr/2001:67c:2218:2::4:1; ns2.nic.fr/192.93.0.4; ns2.nic.fr/2001:660:3005:1::1:2; ns3.nic.fr/192.134.0.49; ns3.nic.fr/2001:660:3006:1::1:1.\n","module":"CONSISTENCY"},{"level":"INFO","message":"Un unique numéro de série a été trouvé dans les enregistrements de type \"SOA\" de la zone testée (2019102803).\n","module":"CONSISTENCY"},{"level":"INFO","message":"Une unique adresse mail a été trouvée dans les enregistrements de type \"SOA\" de la zone testée (hostmaster.nic.fr.).\n","module":"CONSISTENCY"},{"level":"INFO","message":"Un unique ensemble de paramètres temporels a été trouvé (REFRESH=7200, RETRY=1800, EXPIRE=2419200, MINIMUM=5400).\n","module":"CONSISTENCY"},{"level":"INFO","message":"Un unique ensemble de serveurs de noms est configuré sur les serveurs de la zone testée (ns1.nic.fr., ns2.nic.fr., ns3.nic.fr.).\n","module":"CONSISTENCY"},{"level":"INFO","message":"La liste des adresses IP des serveurs de nom retournée par les serveurs de noms de la zone parente et par ceux de la zone est identique.\n","module":"CONSISTENCY"},{"level":"INFO","message":"A single SOA mname value was seen (dnsmaster.nic.fr.)\n","module":"CONSISTENCY"},{"level":"INFO","message":"Des enregistrements de type \"DS\" ont été trouvés avec les tags suivants 37610.\n","module":"DNSSEC"},{"level":"INFO","message":"Il y a des enregistrements de type \"DS\" et \"DNSKEY\" partageant les mêmes tag de clé 37610.\n","module":"DNSSEC"},{"level":"INFO","message":"L'enregistrement de type \"DS\" avec le tag de clé 37610 et de type de condensat \"2\" correspond à l'enregistrement de type \"DNSKEY\" ayant le même tag.\n","module":"DNSSEC"},{"level":"INFO","message":"Au moins un enregistrement de type \"DS\" avec un enregistrement de type \"DNSKEY\" correspondant a été trouvé.\n","module":"DNSSEC"},{"level":"INFO","message":"La signature (RRSIG) avec la champ keytag 37610 et couvrant les enregistrements de type(s) \"DNSKEY\" expire à la date suivante : Tue Nov 26 16:29:20 2019.\n","module":"DNSSEC"},{"level":"INFO","message":"La signature (RRSIG) avec la champ keytag 52935 et couvrant les enregistrements de type(s) \"SOA\" expire à la date suivante : Tue Nov 26 23:36:20 2019.\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 37610 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 52935 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 52935 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 37610 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 37610 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 52935 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 37610 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 52935 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 37610 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 52935 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 37610 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La clé (DNSKEY) avec le tag 52935 utilise un numéro d'algorithme correct 8/(RSASHA256).\n","module":"DNSSEC"},{"level":"INFO","message":"La zone a des enregistrements de type \"NSEC3\".\n","module":"DNSSEC"},{"level":"INFO","message":"L'opt-out est mis en oeuvre pour des enregistrements de type \"NSEC3\".\n","module":"DNSSEC"},{"level":"INFO","message":"L'enregistrement DS dans la zone parente est correctement signé.\n","module":"DNSSEC"},{"level":"INFO","message":"Les serveurs de noms de la zone parente retournent suffisamment de serveurs (3) faisant autorité (ns1.nic.fr; ns2.nic.fr; ns3.nic.fr). La limite inférieure étant fixée à 2.\n","module":"DELEGATION"},{"level":"INFO","message":"Les serveurs de noms de la zone retournent suffisamment de serveurs (3) faisant autorité (ns1.nic.fr; ns2.nic.fr; ns3.nic.fr). La limite inférieure étant fixée à 2.\n","module":"DELEGATION"},{"level":"INFO","message":"Child lists enough (3) nameservers that resolve to IPv4 addresses (192.134.0.49; 192.134.4.1; 192.93.0.4). Lower limit set to 2.\n","module":"DELEGATION"},{"level":"INFO","message":"Child lists enough (3) nameservers that resolve to IPv6 addresses (192.134.0.49; 192.134.4.1; 192.93.0.4). Lower limit set to 2.\n","module":"DELEGATION"},{"level":"INFO","message":"Delegation lists enough (3) nameservers that resolve to IPv4 addresses (192.134.0.49; 192.134.4.1; 192.93.0.4). Lower limit set to 2.\n","module":"DELEGATION"},{"level":"INFO","message":"Delegation lists enough (3) nameservers that resolve to IPv6 addresses (2001:660:3005:1::1:2; 2001:660:3006:1::1:1; 2001:67c:2218:2::4:1). Lower limit set to 2.\n","module":"DELEGATION"},{"level":"INFO","message":"All the IP addresses used by the nameservers in parent are unique.\n","module":"DELEGATION"},{"level":"INFO","message":"All the IP addresses used by the nameservers in child are unique.\n","module":"DELEGATION"},{"level":"INFO","message":"Toutes les adresses IP utilisées par les serveurs de noms sont uniques.\n","module":"DELEGATION"},{"level":"INFO","message":"La plus petite taille d'un paquet légal contenant une référence (referral) est inférieure à 513 octets (elle est de 373).\n","module":"DELEGATION"},{"level":"INFO","message":"Ces serveurs de noms ont pu être vérifiés comme faisant autorité : ns1.nic.fr, ns2.nic.fr, ns3.nic.fr.\n","module":"DELEGATION"},{"level":"INFO","message":"Aucun serveur de noms ne pointe sur un alias (CNAME).\n","module":"DELEGATION"},{"level":"INFO","message":"Tous les serveurs de noms retournent un enregistrement de type \"SOA\".\n","module":"DELEGATION"},{"level":"INFO","message":"Tous les serveurs de noms de la zone font partie de la liste des serveurs de noms retournés par les serveurs de noms de la zone parente ainsi que par les serveurs de noms de la zone elle-même.\n","module":"DELEGATION"},{"ns":"ns2.nic.fr","level":"INFO","message":"Le serveur de noms ns2.nic.fr/2001:660:3005:1::1:2 n'est pas un récurseur.\n","module":"NAMESERVER"},{"ns":"ns2.nic.fr","level":"INFO","message":"Le serveur de noms ns2.nic.fr/192.93.0.4 n'est pas un récurseur.\n","module":"NAMESERVER"},{"ns":"ns1.nic.fr","level":"INFO","message":"Le serveur de noms ns1.nic.fr/2001:67c:2218:2::4:1 n'est pas un récurseur.\n","module":"NAMESERVER"},{"ns":"ns3.nic.fr","level":"INFO","message":"Le serveur de noms ns3.nic.fr/192.134.0.49 n'est pas un récurseur.\n","module":"NAMESERVER"},{"ns":"ns1.nic.fr","level":"INFO","message":"Le serveur de noms ns1.nic.fr/192.134.4.1 n'est pas un récurseur.\n","module":"NAMESERVER"},{"ns":"ns3.nic.fr","level":"INFO","message":"Le serveur de noms ns3.nic.fr/2001:660:3006:1::1:1 n'est pas un récurseur.\n","module":"NAMESERVER"},{"ns":"All","level":"INFO","message":"Les serveurs de noms suivants supportent EDNS0 : ns2.nic.fr/2001:660:3005:1::1:2, ns2.nic.fr/192.93.0.4, ns1.nic.fr/2001:67c:2218:2::4:1, ns3.nic.fr/192.134.0.49, ns1.nic.fr/192.134.4.1, ns3.nic.fr/2001:660:3006:1::1:1.\n","module":"NAMESERVER"},{"ns":"ns1.nic.fr","level":"INFO","message":"Il n'est pas  possible de réaliser un transfert de zone depuis le serveur de noms ns1.nic.fr/192.134.4.1.\n","module":"NAMESERVER"},{"ns":"ns1.nic.fr","level":"INFO","message":"Il n'est pas  possible de réaliser un transfert de zone depuis le serveur de noms ns1.nic.fr/2001:67c:2218:2::4:1.\n","module":"NAMESERVER"},{"ns":"ns2.nic.fr","level":"INFO","message":"Il n'est pas  possible de réaliser un transfert de zone depuis le serveur de noms ns2.nic.fr/192.93.0.4.\n","module":"NAMESERVER"},{"ns":"ns2.nic.fr","level":"INFO","message":"Il n'est pas  possible de réaliser un transfert de zone depuis le serveur de noms ns2.nic.fr/2001:660:3005:1::1:2.\n","module":"NAMESERVER"},{"ns":"ns3.nic.fr","level":"INFO","message":"Il n'est pas  possible de réaliser un transfert de zone depuis le serveur de noms ns3.nic.fr/192.134.0.49.\n","module":"NAMESERVER"},{"ns":"ns3.nic.fr","level":"INFO","message":"Il n'est pas  possible de réaliser un transfert de zone depuis le serveur de noms ns3.nic.fr/2001:660:3006:1::1:1.\n","module":"NAMESERVER"},{"ns":"All","level":"INFO","message":"Tous les serveurs de noms répondent avec la même adresse IP que celle utilisée lors de leur requêtage.\n","module":"NAMESERVER"},{"ns":"All","level":"INFO","message":"Les serveurs de noms suivants répondent correctement aux requêtes de type \"AAAA\" : ns2.nic.fr/2001:660:3005:1::1:2, ns2.nic.fr/192.93.0.4, ns1.nic.fr/2001:67c:2218:2::4:1, ns3.nic.fr/192.134.0.49, ns1.nic.fr/192.134.4.1, ns3.nic.fr/2001:660:3006:1::1:1.\n","module":"NAMESERVER"},{"ns":"All","level":"INFO","message":"Il a été possible de trouver au moins une adresse IP pour tous les serveurs de noms.\n","module":"NAMESERVER"},{"ns":"All","level":"INFO","message":"Aucun des serveurs de noms suivants ne répond à la requête de type \"NS\" sur la racine '.' (upward referral) : ns1.nic.fr, ns2.nic.fr, ns3.nic.fr.\n","module":"NAMESERVER"},{"ns":"ns1.nic.fr","level":"INFO","message":"Le serveur de noms ns1.nic.fr/192.134.4.1 conserve la casse des noms requêtés dans les réponses 'wWW.afNic.Fr'.\n","module":"NAMESERVER"},{"ns":"ns1.nic.fr","level":"INFO","message":"Le serveur de noms ns1.nic.fr/2001:67c:2218:2::4:1 conserve la casse des noms requêtés dans les réponses 'wWW.afNic.Fr'.\n","module":"NAMESERVER"},{"ns":"ns2.nic.fr","level":"INFO","message":"Le serveur de noms ns2.nic.fr/192.93.0.4 conserve la casse des noms requêtés dans les réponses 'wWW.afNic.Fr'.\n","module":"NAMESERVER"},{"ns":"ns2.nic.fr","level":"INFO","message":"Le serveur de noms ns2.nic.fr/2001:660:3005:1::1:2 conserve la casse des noms requêtés dans les réponses 'wWW.afNic.Fr'.\n","module":"NAMESERVER"},{"ns":"ns3.nic.fr","level":"INFO","message":"Le serveur de noms ns3.nic.fr/192.134.0.49 conserve la casse des noms requêtés dans les réponses 'wWW.afNic.Fr'.\n","module":"NAMESERVER"},{"ns":"ns3.nic.fr","level":"INFO","message":"Le serveur de noms ns3.nic.fr/2001:660:3006:1::1:1 conserve la casse des noms requêtés dans les réponses 'wWW.afNic.Fr'.\n","module":"NAMESERVER"},{"ns":"All","level":"INFO","message":"Lors d'une requête de type SOA pour la ressource \"www.afNiC.Fr\" avec des casses différentes,  tous les serveurs retournent les mêmes résultats.\n","module":"NAMESERVER"},{"level":"INFO","message":"Le nom de domaine 'afNiC.Fr' ne contient aucun caractère interdit.\n","module":"SYNTAX"},{"level":"INFO","message":"Aucune des extrémités des labels du nom de domain 'afNiC.Fr' n'est un tiret '-'.\n","module":"SYNTAX"},{"level":"INFO","message":"Le nom de domaine 'afNiC.Fr' n'a aucun label contenant un double tiret ('--') en positions 3 et 4 (avec un préfixe différent de 'xn--').\n","module":"SYNTAX"},{"level":"INFO","message":"La syntaxe du nom du serveur de noms (ns1.nic.fr) est valide.\n","module":"SYNTAX"},{"level":"INFO","message":"La syntaxe du nom du serveur de noms (ns2.nic.fr) est valide.\n","module":"SYNTAX"},{"level":"INFO","message":"La syntaxe du nom du serveur de noms (ns3.nic.fr) est valide.\n","module":"SYNTAX"},{"level":"INFO","message":"Il n'y a aucun caractère '@' dans le champ RNAME (hostmaster.nic.fr.) du SOA.\n","module":"SYNTAX"},{"level":"INFO","message":"Le champ RNAME (hostmaster@nic.fr) du SOA est conforme aux règles définies dans le RFC2822.\n","module":"SYNTAX"},{"level":"INFO","message":"La syntaxe du nom du serveur maître défini dans le SOA,  'mname' (dnsmaster.nic.fr) est valide.\n","module":"SYNTAX"},{"level":"INFO","message":"La syntaxe du nom du relais de messagerie (mx4.nic.fr) est valide.\n","module":"SYNTAX"},{"level":"INFO","message":"La syntaxe du nom du relais de messagerie (mx5.nic.fr) est valide.\n","module":"SYNTAX"},{"level":"NOTICE","message":"Le serveur maître défini dans le SOA,  'mname' dnsmaster.nic.fr/192.134.4.2,  ne répond pas.\n","module":"ZONE"},{"level":"NOTICE","message":"Le serveur maître défini dans le SOA,  'mname' (dnsmaster.nic.fr),  ne fait pas partie des enregistrements de type \"NS\" listés par la zone parente (ns1.nic.fr; ns2.nic.fr; ns3.nic.fr).\n","module":"ZONE"},{"level":"NOTICE","message":"Dans le SOA,  la valeur du champ 'refresh' (7200) est plus petite que la valeur recommandée (14400).\n","module":"ZONE"},{"level":"INFO","message":"Dans le SOA,  la valeur du champ 'refresh' (7200) est plus grande que la valeur du champ 'retry' (1800).\n","module":"ZONE"},{"level":"NOTICE","message":"Dans le SOA,  la valeur du champ 'retry' (1800) est plus petite que la valeur recommandée (3600).\n","module":"ZONE"},{"level":"INFO","message":"Dans le SOA,  la valeur du champ 'expire' (2419200) est plus grande que la valeur minimale recommandée (604800) et pas plus petite que la valeur du champ 'refresh' (7200).\n","module":"ZONE"},{"level":"INFO","message":"Dans le SOA,  la valeur du champ 'minimum' (5400) est comprise dans l'interval de valeurs recommandées (300/86400).\n","module":"ZONE"},{"level":"INFO","message":"Le serveur maître défini dans le SOA,  'mname' (dnsmaster.nic.fr),  fait référence à un serveur de noms qui n'est pas un alias (CNAME).\n","module":"ZONE"},{"level":"INFO","message":"Le serveur maître défini dans le SOA,  'mname' (dnsmaster.nic.fr),  fait référence à un serveur de noms qui n'est pas un alias (CNAME).\n","module":"ZONE"},{"level":"INFO","message":"L'enregistrement de type \"MX\" pour le domaine ne pointe pas sur un alias (CNAME).\n","module":"ZONE"},{"level":"INFO","message":"Information (MX=mx4.nic.fr/MX=mx5.nic.fr) trouvée pour faire parvenir un message à ce nom de domaine.\n","module":"ZONE"}]
      }
    }
  },

  // FR23 - Should display previous tests
  // FR24 - Should display previous run link
  // FR25 - Should have an export button
  // FR25 - Should open a modal that contains four export possibilities
  {
    url: 'https://zonemaster.net/api',
    body: {'jsonrpc': '2.0', 'id': 1572271917712, 'method': 'get_test_history', 'params': {'offset': 0, 'limit': 100, 'filter': 'all', 'frontend_params': {'domain': 'results.afNiC.Fr'}}},
    method: 'POST',
    json: {'jsonrpc': '2.0', 'id': 1572271917712, 'result': [
      {'overall_result': 'error', 'created_at': '2019-10-28T09:24:57Z', 'creation_time': '2019-10-28 09:42:42.432378', 'id': '293f626579274f18'},
      {'overall_result': 'ok', 'created_at': '2019-10-28T09:24:57Z', 'creation_time': '2019-10-28 09:24:57.395431', 'id': '84bfac6ae74d0e62'},
      {'overall_result': 'ok', 'created_at': '2019-10-24T07:49:48Z', 'creation_time': '2019-10-24 07:49:48.079617', 'id': 'efe0931716b0068c'},
      {'overall_result': 'ok', 'created_at': '2019-10-24T07:49:16Z', 'creation_time': '2019-10-24 07:49:16.271481', 'id': '46acbdcbc456db1d'},
      {'overall_result': 'ok', 'created_at': '2019-10-24T07:35:52Z', 'creation_time': '2019-10-24 07:35:52.819536', 'id': 'fd5b10ae1a46ce5e'},
      {'overall_result': 'ok', 'created_at': '2019-10-24T07:35:21Z', 'creation_time': '2019-10-24 07:35:21.309154', 'id': '1b29b0582a99d7ab'},
      {'overall_result': 'ok', 'created_at': '2019-10-24T06:51:22Z', 'creation_time': '2019-10-24 06:51:22.373411', 'id': '8c4829b7f60edc25'},
      {'overall_result': 'ok', 'created_at': '2019-10-24T06:50:50Z', 'creation_time': '2019-10-24 06:50:50.801272', 'id': '9b89a0988dbccfdb'},
      {'overall_result': 'ok', 'created_at': '2019-10-24T06:39:37Z', 'creation_time': '2019-10-24 06:39:37.48699', 'id': '89c662ddd43a8b03'},
      {'overall_result': 'ok', 'created_at': '2019-10-24T06:39:05Z', 'creation_time': '2019-10-24 06:39:05.851497', 'id': '2add42a68594b37a'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T20:59:41Z', 'creation_time': '2019-10-23 20:59:41.594768', 'id': 'c334d7eb96af1d19'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T20:55:13Z', 'creation_time': '2019-10-23 20:55:13.205118', 'id': 'b4146c79de8b3638'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T20:46:06Z', 'creation_time': '2019-10-23 20:46:06.989113', 'id': '226f6d4f44ae3f80'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T20:40:46Z', 'creation_time': '2019-10-23 20:40:46.272244', 'id': 'a509e33a41f28322'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T20:34:21Z', 'creation_time': '2019-10-23 20:34:21.681947', 'id': '5d41c57fa24c76f5'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T20:28:25Z', 'creation_time': '2019-10-23 20:28:25.518303', 'id': '298b4c53d5024f44'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T20:16:39Z', 'creation_time': '2019-10-23 20:16:39.466781', 'id': 'f9c587426b885036'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T19:41:31Z', 'creation_time': '2019-10-23 19:41:31.048622', 'id': 'bb2109eb54d9ef58'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T16:20:56Z', 'creation_time': '2019-10-23 16:20:56.180064', 'id': '3ff7e65752a431e8'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T15:37:05Z', 'creation_time': '2019-10-23 15:37:05.935049', 'id': 'e8a3507cce49392d'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T15:25:35Z', 'creation_time': '2019-10-23 15:25:35.162808', 'id': '19f7773777cdad1a'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T15:09:54Z', 'creation_time': '2019-10-23 15:09:54.801371', 'id': '61907eb87c8bb1d9'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T14:52:56Z', 'creation_time': '2019-10-23 14:52:56.823486', 'id': '497ce5549e80d6d1'},
      {'overall_result': 'ok', 'created_at': '2019-10-23T14:39:25Z', 'creation_time': '2019-10-23 14:39:25.259204', 'id': '470e62da84dcbd16'},
      {'overall_result': 'error', 'created_at': '2019-10-23T14:26:35Z', 'creation_time': '2019-10-23 14:26:35.853106', 'id': '9b8e25c35dc365ac'}
    ]}
  },
];

@Injectable()
export class HttpMockRequestInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    for (const element of urls) {

      // Don't compare client info
      let requestParams = {...request.body?.params};
      delete requestParams['client_version'];
      delete requestParams['client_id'];

      if (request.url === element.url
        && request.method === element.method
        && request.body.method === element.body.method
        && JSON.stringify(requestParams) === JSON.stringify(element.body.params)
      ) {
        console.log('Loaded from json: ' + request.body.method );
        return of(new HttpResponse({ status: 200, body: element.json }));
      }
    }
    console.log('Loaded from http call :' + request.url);
    return next.handle(request);
  }
}
