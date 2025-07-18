import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Copy,
  Save,
  Trash,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Link,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// Import your data from another file or define them here later:
// import { documentationLinks, documentationCategories, premadeTemplates } from "./data"

// Fallbacks if those are not yet defined:
// const documentationLinks = [];
export const documentationCategories = {
  advanced_cards: {
    en: "Advanced Cards",
    es: "Tarjetas Avanzadas",
    fr: "Cartes Avancées",
    it: "Carte Avanzate",
    de: "Erweiterte Karten",
  },
  paypal_button: {
    en: "PayPal Button",
    es: "Botón de PayPal",
    fr: "Bouton PayPal",
    it: "Pulsante PayPal",
    de: "PayPal-Schaltfläche",
  },
  paypal_lpm: {
    en: "PayPal Local Payment Methods",
    es: "Métodos de Pago Locales PayPal",
    fr: "Méthodes de Paiement Locales PayPal",
    it: "Metodi di pagamento locali PayPal",
    de: "Lokale Zahlungsmethoden von PayPal",
  },
  invoicing: {
    en: "Invoicing",
    es: "Facturación",
    fr: "Facturation",
    it: "Fatturazione",
    de: "Rechnungsstellung",
  },
  shipping: {
    en: "Shipping Module",
    es: "Módulo de Envío",
    fr: "Module Expédition",
    it: "Modulo Spedizione",
    de: "Versandmodul",
  },
  contact: {
    en: "Contact Module",
    es: "Módulo de Contacto",
    fr: "Module Contact",
    it: "Modulo Contatti",
    de: "Kontaktmodul",
  },
  line_items: {
    en: "Line Items",
    es: "Artículos",
    fr: "Articles",
    it: "Elementi",
    de: "Posten",
  },
  app_switch: {
    en: "App Switch",
    es: "Cambio de App",
    fr: "Changement d’application",
    it: "Cambio App",
    de: "App-Wechsel",
  },
  pay_later: {
    en: "Pay Later",
    es: "Pagar Después",
    fr: "Payer Plus Tard",
    it: "Paga Dopo",
    de: "Später Bezahlen",
  },
  webhooks: {
    en: "Webhooks",
    es: "Webhooks",
    fr: "Webhooks",
    it: "Webhooks",
    de: "Webhooks",
  },
  rest_api: {
    en: "REST API",
    es: "API REST",
    fr: "API REST",
    it: "REST API",
    de: "REST API",
  },
  server_sdk: {
    en: "Server SDK",
    es: "SDK del Servidor",
    fr: "SDK Serveur",
    it: "SDK Server",
    de: "Server-SDK",
  },
  sdk_config: {
    en: "SDK Configuration",
    es: "Configuración del SDK",
    fr: "Configuration du SDK",
    it: "Configurazione SDK",
    de: "SDK-Konfiguration",
  },
  apple_pay: {
    en: "Apple Pay",
    es: "Apple Pay",
    fr: "Apple Pay",
    it: "Apple Pay",
    de: "Apple Pay",
  },
  google_pay: {
    en: "Google Pay",
    es: "Google Pay",
    fr: "Google Pay",
    it: "Google Pay",
    de: "Google Pay",
  },
  dropin_ui: {
    en: "Drop-in UI",
    es: "Interfaz Drop-in",
    fr: "Interface Drop-in",
    it: "UI Drop-in",
    de: "Drop-in-Oberfläche",
  },
  hosted_fields: {
    en: "Hosted Fields",
    es: "Campos Alojados",
    fr: "Champs Hébergés",
    it: "Campi Ospitati",
    de: "Gehostete Felder",
  },
  braintree_apple_pay: {
    en: "Braintree Apple Pay",
    es: "Braintree Apple Pay",
    fr: "Braintree Apple Pay",
    it: "Braintree Apple Pay",
    de: "Braintree Apple Pay",
  },
  braintree_google_pay: {
    en: "Braintree Google Pay",
    es: "Braintree Google Pay",
    fr: "Braintree Google Pay",
    it: "Braintree Google Pay",
    de: "Braintree Google Pay",
  },
  braintree_lpm: {
    en: "Braintree Local Payment Methods",
    es: "Métodos de Pago Locales Braintree",
    fr: "Méthodes de Paiement Locales Braintree",
    it: "Metodi di pagamento locali Braintree",
    de: "Lokale Zahlungsmethoden Braintree",
  },
};

export const premadeTemplates = [
  {
    key: "introduction",
    name: {
      en: "Introduction Email",
      es: "Correo de Introducción",
      fr: "E-mail d’introduction",
      it: "Email di Presentazione",
      de: "Einführungs-E-Mail",
    },
    subject: {
      en: "PayPal integration support - [Business name]",
      es: "Soporte de integración de PayPal - [Nombre del negocio]",
      fr: "Assistance d'intégration PayPal - [Nom de l’entreprise]",
      it: "Supporto per l'integrazione PayPal - [Nome dell’azienda]",
      de: "PayPal-Integrationssupport – [Firmenname]",
    },
    body: {
      en: `Hi {{merchantName}},\n\nHope you are keeping well.\n\nI'm pleased to meet you. My name is {{engineerName}}, part of the integration team here at PayPal, and I will be working with you while integrating PayPal into your application.\n\nIf you could reply to this email answering the following questions: \n-What coding language(s) do you use? \n-Your live expected date \n-Any issues you are currently having (screenshots and screen recordings are encouraged)\n\nBelow is the documentation that you will need to integrate the payment methods you wish to add to your checkout\n\n\n\nKind regards,\n{{engineerName}}`,
      es: `Hola {{merchantName}},\n\nEspero que estés bien.\n\nEncantado de conocerte. Mi nombre es {{engineerName}}, del equipo de integración de PayPal. Estaré ayudando con tu integración.\n\n¿Podrías responder a este correo con la siguiente información?:\n-¿Qué lenguaje(s) de programación usas?\n-Tu fecha estimada de puesta en marcha\n-Cualquier problema actual (se agradecen capturas y grabaciones)\n\nAbajo tienes la documentación necesaria para la integración.\n\nSaludos,\n{{engineerName}}`,
      fr: `Bonjour {{merchantName}},\n\nJ’espère que vous allez bien.\n\nEnchanté de faire votre connaissance. Je m’appelle {{engineerName}}, de l’équipe d’intégration PayPal, et je vous accompagnerai.\n\nMerci de répondre à cet email en précisant :\n-Langage(s) utilisé(s)\n-Date de mise en production prévue\n-Problèmes actuels (captures d’écran bienvenues)\n\nVous trouverez ci-dessous la documentation utile pour intégrer les méthodes de paiement souhaitées.\n\nCordialement,\n{{engineerName}}`,
      it: `Ciao {{merchantName}},\n\nSpero tu stia bene.\n\nPiacere di conoscerti. Sono {{engineerName}}, del team d’integrazione PayPal e ti accompagnerò nell'integrazione.\n\nTi chiedo di rispondere alle seguenti domande:\n-Quali linguaggi di programmazione usi?\n-Data di lancio prevista\n-Eventuali problemi riscontrati (allega screenshot/video)\n\nSotto trovi la documentazione necessaria per integrare i metodi di pagamento.\n\nCordiali saluti,\n{{engineerName}}`,
      de: `Hallo {{merchantName}},\n\nIch hoffe, es geht dir gut.\n\nMein Name ist {{engineerName}}. Ich bin im Integrationsteam von PayPal und begleite dich bei der Integration.\n\nBitte antworte auf diese E-Mail mit:\n-Welche Programmiersprache nutzt du?\n-Voraussichtlicher Live-Termin\n-Aktuelle Probleme (Screenshots gern gesehen)\n\nUnten findest du die Dokumentation zur Integration der gewünschten Zahlungsmethoden.\n\nViele Grüße,\n{{engineerName}}`,
    },
  },
  {
    key: "follow_up",
    name: {
      en: "Follow-up Email",
      es: "Correo de Seguimiento",
      fr: "E-mail de Relance",
      it: "Email di Sollecito",
      de: "Folge-E-Mail",
    },
    subject: {
      en: "Reminder: Integration Progress",
      es: "Recordatorio: Progreso de la Integración",
      fr: "Rappel : Avancement de l'intégration",
      it: "Promemoria: Avanzamento dell'Integrazione",
      de: "Erinnerung: Integrationsfortschritt",
    },
    body: {
      en: `Hi {{merchantName}},\n\nHope you are well.\n\nUnfortunately, due to a lack of engagement with the integration, I will have to stop support. I understand you are busy, but we need to keep the integration moving.\n\nIf you could get back to me before the end of the week, that would be great; otherwise, support will have to stop.\n\nHope to hear from you soon.\n\nKind regards,\n{{engineerName}}`,
      es: `Hola {{merchantName}},\n\nEspero que estés bien.\n\nDebido a la falta de avances en la integración, tendré que detener el soporte. Entiendo que estás ocupado, pero debemos seguir avanzando con la integración.\n\nSi puedes responderme antes de fin de semana, perfecto; si no, tendré que suspender el soporte.\n\nUn saludo,\n{{engineerName}}`,
      fr: `Bonjour {{merchantName}},\n\nJ’espère que tout va bien.\n\nFaute d’avancées sur l’intégration, je devrai suspendre l’accompagnement. Je comprends que vous soyez occupé, mais il est important d’avancer.\n\nMerci de me répondre avant la fin de la semaine ; sinon, le support sera arrêté.\n\nCordialement,\n{{engineerName}}`,
      it: `Ciao {{merchantName}},\n\nSpero tu stia bene.\n\nPurtroppo, a causa della mancanza di avanzamenti, dovrò sospendere il supporto. Capisco i tuoi impegni, ma dobbiamo proseguire l’integrazione.\n\nSe riesci a rispondermi entro la settimana bene; altrimenti sarò costretto ad interrompere il supporto.\n\nCordiali saluti,\n{{engineerName}}`,
      de: `Hallo {{merchantName}},\n\nIch hoffe, es geht dir gut.\n\nMangels Rückmeldung zum Integrationsfortschritt muss ich den Support einstellen. Ich verstehe, dass du beschäftigt bist, aber wir müssen die Integration vorantreiben.\n\nMelde dich bitte bis Ende der Woche. Andernfalls stelle ich den Support ein.\n\nViele Grüße,\n{{engineerName}}`,
    },
  },
  {
    key: "final_follow_up",
    name: {
      en: "Final Follow-up Email",
      es: "Último Correo de Seguimiento",
      fr: "Dernier E-mail de Relance",
      it: "Ultimo Sollecito",
      de: "Letzte Folge-E-Mail",
    },
    subject: {
      en: "Integration Follow-up",
      es: "Seguimiento de Integración",
      fr: "Relance Intégration",
      it: "Follow-up Integrazione",
      de: "Erinnerung Integration",
    },
    body: {
      en: `Hi {{merchantName}},\n\nI hope you're well!\n\nJust following up from my last email regarding the integration. If you have any questions, please reach out — I am happy to help with any queries you might have.\n\nKind regards,\n{{engineerName}}`,
      es: `Hola {{merchantName}},\n\n¡Espero que estés bien!\n\nSolo quería dar seguimiento a mi último email sobre la integración. Si tienes dudas, no dudes en escribirme.\n\nSaludos,\n{{engineerName}}`,
      fr: `Bonjour {{merchantName}},\n\nJ’espère que vous allez bien !\n\nJe fais suite à mon dernier e-mail concernant l’intégration. N’hésitez pas si vous avez des questions.\n\nCordialement,\n{{engineerName}}`,
      it: `Ciao {{merchantName}},\n\nSpero tu stia bene!\n\nSolo un rapido sollecito dopo la mia ultima email sull’integrazione. Per qualsiasi domanda sono a disposizione.\n\nCordiali saluti,\n{{engineerName}}`,
      de: `Hallo {{merchantName}},\n\nIch hoffe es geht dir gut!\n\nLetztes Follow-up zur Integration. Bei Fragen stehe ich gern zur Verfügung.\n\nViele Grüße,\n{{engineerName}}`,
    },
  },
  {
    key: "integration_launched",
    name: {
      en: "Integration Launched Email",
      es: "Correo: Integración Lanzada",
      fr: "E-mail : Intégration Lancée",
      it: "Email: Integrazione Avviata",
      de: "E-Mail: Integration gestartet",
    },
    subject: {
      en: "Integration Launched - Support & Resources",
      es: "Integración Lanzada - Soporte y Recursos",
      fr: "Intégration lancée – Support & Ressources",
      it: "Integrazione Avviata – Supporto & Risorse",
      de: "Integration gestartet – Support & Ressourcen",
    },
    body: {
      en: `Hi {{merchantName}},\n\nHope you are well\n\nNow that you are having successful PayPal transactions, I am pleased to inform you that I will be available for the next 14 days to respond to any integration related issues or inquiries you may have.\n\nHelpful links and references: \n[PayPal Reports](https://developer.paypal.com/docs/reports/) \n-[PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal) \n-[PayPal Help Center (Video)](https://www.paypal.com/us/cshelp/business) \n-[PayPal Status Page](https://www.paypal-status.com/product/production)\n\nKind regards,\n{{engineerName}}`,
      es: `Hola {{merchantName}},\n\nAhora que tienes transacciones exitosas en PayPal, estaré disponible los próximos 14 días para resolver dudas o problemas asociados a la integración.\n\nEnlaces de interés:\n[PayPal Reports](https://developer.paypal.com/docs/reports/)\n-[PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n-[Centro de ayuda PayPal (Video)](https://www.paypal.com/us/cshelp/business)\n-[Página de Estado PayPal](https://www.paypal-status.com/product/production)\n\nSaludos,\n{{engineerName}}`,
      fr: `Bonjour {{merchantName}},\n\nDepuis que vos transactions PayPal sont en ligne, je suis disponible pendant 14 jours pour toute question ou souci lié à l’intégration.\n\nLiens utiles :\n[PayPal Reports](https://developer.paypal.com/docs/reports/)\n-[PayPal Reports (Vidéo)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n-[Aide PayPal (Vidéo)](https://www.paypal.com/us/cshelp/business)\n-[Status PayPal](https://www.paypal-status.com/product/production)\n\nCordialement,\n{{engineerName}}`,
      it: `Ciao {{merchantName}},\n\nOra che ricevi transazioni PayPal con successo, resterò a disposizione per i prossimi 14 giorni per ogni dubbio o problema sull’integrazione.\n\nLink utili:\n[PayPal Reports](https://developer.paypal.com/docs/reports/)\n-[PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n-[Centro assistenza PayPal (Video)](https://www.paypal.com/us/cshelp/business)\n-[Status PayPal](https://www.paypal-status.com/product/production)\n\nCordiali saluti,\n{{engineerName}}`,
      de: `Hallo {{merchantName}},\n\nJetzt, wo Sie erfolgreiche PayPal-Transaktionen haben, bin ich in den nächsten 14 Tagen für Integrationsfragen oder Probleme erreichbar.\n\nHilfreiche Links:\n[PayPal Reports](https://developer.paypal.com/docs/reports/)\n-[PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n-[Hilfe-Center PayPal (Video)](https://www.paypal.com/us/cshelp/business)\n-[PayPal Status](https://www.paypal-status.com/product/production)\n\nViele Grüße,\n{{engineerName}}`,
    },
  },
  {
    key: "integration_completed",
    name: {
      en: "Integration completed Email",
      es: "Correo: Integración Completada",
      fr: "E-mail : Intégration terminée",
      it: "Email: Integrazione completata",
      de: "E-Mail: Integration abgeschlossen",
    },
    subject: {
      en: "Integration completed",
      es: "Integración Completada",
      fr: "Intégration terminée",
      it: "Integrazione completata",
      de: "Integration abgeschlossen",
    },
    body: {
      en: `Hi {{merchantName}},\n\nI am sending you some information about where to find support for your PayPal integration going forward now that your dedicated engineer support is over.\n\nHelpful links and references:\n\n- [How do I issue refunds](https://www.paypal.com/ie/cshelp/article/how-do-i-issue-a-refund-help101)\n- [PayPal Reports](https://developer.paypal.com/docs/reports/)\n- [PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n- [PayPal Help Center (Video)](https://www.paypal.com/us/cshelp/business)\n- [PayPal Status Page](https://www.paypal-status.com/product/production)\n\nCan’t find what you are looking for?\n\nIf you develop any technical issue that may require an engineer support, you can contact the Merchant Technical Support center (MTS).\n\nMTS offers in-depth technical and developer support resources, as well as our active global community. If you need direct support, our dedicated, 24-hour team of experts are available.\n\nTo submit a ticket to MTS:\n\n- Visit the Help Center and click on 'Contact us'\n- Login with your PayPal Business account credentials\n- Fill in case details\n\n[Click here](https://www.paypal-techsupport.com/s/?language=en_US)\n\nComplete the form with as much information as possible and ensure that you use the Primary email address that is associated with your PayPal account. This is very important since entering an incorrect email will affect how our system prioritizes the ticket.\n\nOnce your ticket has been created, Merchant Technical Support will manage the case and reach out to you.\n\nI wish you all the best with your PayPal journey.\n\nKind regards,\n{{engineerName}}`,
      es: `Hola {{merchantName}},\n\nTe envío información sobre cómo obtener soporte para tu integración PayPal una vez terminado el soporte dedicado del ingeniero.\n\nEnlaces de interés:\n- [¿Cómo emito reembolsos?](https://www.paypal.com/ie/cshelp/article/how-do-i-issue-a-refund-help101)\n- [PayPal Reports](https://developer.paypal.com/docs/reports/)\n- [PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n- [Centro de ayuda PayPal (Video)](https://www.paypal.com/us/cshelp/business)\n- [Página de Estado PayPal](https://www.paypal-status.com/product/production)\n\n¿No encuentras lo que buscas?\n\nPara incidencias técnicas puedes contactar con Merchant Technical Support (MTS):\n\n- Accede al Centro de ayuda y haz clic en 'Contacta con nosotros'.\n- Accede con tu cuenta Business de PayPal\n- Rellena los detalles del caso\n\n[Haz clic aquí](https://www.paypal-techsupport.com/s/?language=en_US)\n\nRellena el formulario con todos los detalles posibles y asegúrate de usar el email principal, así priorizamos el ticket correctamente.\n\nMTS gestionará tu caso y se pondrán en contacto contigo.\n\nTe deseo mucho éxito con PayPal.\n\nSaludos,\n{{engineerName}}`,
      fr: `Bonjour {{merchantName}},\n\nVoici des informations utiles pour continuer à obtenir du support sur votre intégration PayPal, maintenant que l’accompagnement dédié touche à sa fin.\n\nLiens utiles :\n- [Comment effectuer des remboursements](https://www.paypal.com/ie/cshelp/article/how-do-i-issue-a-refund-help101)\n- [PayPal Reports](https://developer.paypal.com/docs/reports/)\n- [PayPal Reports (Vidéo)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n- [Aide PayPal (Vidéo)](https://www.paypal.com/us/cshelp/business)\n- [Status PayPal](https://www.paypal-status.com/product/production)\n\nVous ne trouvez pas ce que vous cherchez ?\n\nEn cas de problème technique, contactez le Merchant Technical Support (MTS) :\n\n- Rendez-vous dans le Centre d’aide puis « Contactez-nous »\n- Connectez-vous à votre compte Business PayPal\n- Renseignez les détails du cas\n\n[Cliquez ici](https://www.paypal-techsupport.com/s/?language=en_US)\n\nComplétez le formulaire avec un maximum de détails et utilisez l’e-mail principal associé au compte PayPal, pour une bonne priorisation de votre dossier.\n\nLe support MTS prendra contact avec vous.\n\nJe vous souhaite une excellente aventure avec PayPal.\n\nCordialement,\n{{engineerName}}`,
      it: `Ciao {{merchantName}},\n\nTi invio alcune informazioni su dove trovare supporto per la tua integrazione PayPal ora che è terminato il supporto ingegneristico dedicato.\n\nLink utili:\n- [Come effettuo rimborsi](https://www.paypal.com/ie/cshelp/article/how-do-i-issue-a-refund-help101)\n- [PayPal Reports](https://developer.paypal.com/docs/reports/)\n- [PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n- [Centro assistenza PayPal (Video)](https://www.paypal.com/us/cshelp/business)\n- [Status PayPal](https://www.paypal-status.com/product/production)\n\nNon trovi quello che cerchi?\n\nPer problematiche tecniche puoi rivolgerti al Merchant Technical Support (MTS):\n\n- Vai nel Centro assistenza e clicca su “Contattaci”\n- Accedi con l’account Business PayPal\n- Inserisci i dettagli del caso\n\n[Clicca qui](https://www.paypal-techsupport.com/s/?language=en_US)\n\nCompila il modulo con tutti i dettagli richiesti, usando l’email primaria associata al conto PayPal per un prioritization migliore.\n\nIl supporto MTS prenderà in carico la richiesta e ti contatterà.\n\nTi auguro il meglio nel tuo percorso con PayPal.\n\nCordiali saluti,\n{{engineerName}}`,
      de: `Hallo {{merchantName}},\n\nHier findest du wichtige Infos zum PayPal-Support, nachdem die dedizierte Integration beendet ist.\n\nNützliche Links:\n- [Wie stelle ich Rückerstattungen aus?](https://www.paypal.com/ie/cshelp/article/how-do-i-issue-a-refund-help101)\n- [PayPal Reports](https://developer.paypal.com/docs/reports/)\n- [PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n- [PayPal Hilfe (Video)](https://www.paypal.com/us/cshelp/business)\n- [PayPal Status](https://www.paypal-status.com/product/production)\n\nNicht gefunden, was du brauchst?\n\nBei technischen Problemen hilft Merchant Technical Support (MTS):\n\n- Zum Hilfe-Center und auf 'Kontakt' klicken\n- Im PayPal-Business-Konto anmelden\n- Details zum Fall angeben\n\n[Hier klicken](https://www.paypal-techsupport.com/s/?language=en_US)\n\nGib im Formular so viele Details wie möglich an und verwende die Primär-E-Mail deines PayPal-Kontos – das hilft uns bei der Priorisierung.\n\nNach Erstellung des Tickets übernimmt Merchant Technical Support deinen Fall und meldet sich.\n\nViel Erfolg mit PayPal!\n\nViele Grüße,\n{{engineerName}}`,
    },
  },
];

export const documentationLinks = [
  {
    name: "Developer Studio - Advanced Integration",
    url: "https://developer.paypal.com/studio/checkout/advanced/integrate",
    category: "advanced_cards",
  },
  {
    name: "3D Secure (3DS)",
    url: "https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/",
    category: "advanced_cards",
  },
  {
    name: "3DS Response Parameters",
    url: "https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/response-parameters/",
    category: "advanced_cards",
  },
  {
    name: "3DS Test Scenarios",
    url: "https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/test/",
    category: "advanced_cards",
  },
  {
    name: "Integrate PayPal Checkout",
    url: "https://developer.paypal.com/studio/checkout/standard/integrate",
    category: "paypal_button",
  },
  {
    name: "PayPal Local Payment Methods",
    url: "https://developer.paypal.com/docs/checkout/apm/",
    category: "paypal_lpm",
  },
  {
    name: "Invoicing API Overview",
    url: "https://developer.paypal.com/docs/invoicing/",
    category: "invoicing",
  },
  {
    name: "Enable Shipping Module",
    url: "https://developer.paypal.com/docs/checkout/standard/customize/shipping-module/",
    category: "shipping",
  },
  {
    name: "Contact Module Customization",
    url: "https://developer.paypal.com/docs/checkout/standard/customize/contact-module/",
    category: "contact",
  },
  {
    name: "Pass Line Item Details",
    url: "https://developer.paypal.com/docs/checkout/standard/customize/pass-line-items/",
    category: "line_items",
  },
  {
    name: "Enable App Switch",
    url: "https://developer.paypal.com/docs/checkout/standard/customize/app-switch/",
    category: "app_switch",
  },
  {
    name: "UK Pay Later - Getting Started",
    url: "https://developer.paypal.com/studio/checkout/pay-later/gb",
    category: "pay_later",
  },
  {
    name: "UK Pay Later - Integration Guide",
    url: "https://developer.paypal.com/studio/checkout/pay-later/gb/integrate",
    category: "pay_later",
  },
  {
    name: "Webhooks Documentation",
    url: "https://developer.paypal.com/api/rest/webhooks/",
    category: "webhooks",
  },
  {
    name: "REST API Reference",
    url: "https://developer.paypal.com/api/rest/",
    category: "rest_api",
  },
  {
    name: "Server SDK (Java)",
    url: "https://developer.paypal.com/serversdk/java",
    category: "server_sdk",
  },
  {
    name: "JavaScript SDK Setup",
    url: "https://developer.paypal.com/sdk/js/",
    category: "sdk_config",
  },
  {
    name: "Getting Started",
    url: "https://developer.paypal.com/docs/checkout/apm/apple-pay/",
    category: "apple_pay",
  },
  {
    name: "Video Guide",
    url: "https://youtu.be/E3gUASHQMrU",
    category: "apple_pay",
  },
  {
    name: "Domain Association File (Sandbox)",
    url: "https://paypalobjects.com/devdoc/apple-pay/sandbox/apple-developer-merchantid-domain-association",
    category: "apple_pay",
  },
  {
    name: "Domain Association File (Live)",
    url: "https://paypalobjects.com/devdoc/apple-pay/well-known/apple-developer-merchantid-domain-association",
    category: "apple_pay",
  },
  {
    name: "Register Domain (Sandbox)",
    url: "https://www.sandbox.paypal.com/uccservicing/apm/applepay",
    category: "apple_pay",
  },
  {
    name: "Register Domain (Live)",
    url: "https://www.paypal.com/uccservicing/apm/applepay",
    category: "apple_pay",
  },
  {
    name: "Getting Started",
    url: "https://developer.paypal.com/docs/checkout/apm/google-pay/",
    category: "google_pay",
  },
  {
    name: "SCA / 3DS",
    url: "https://developer.paypal.com/docs/checkout/apm/google-pay/#link-strongcustomerauthenticationsca",
    category: "google_pay",
  },
  {
    name: "Drop-in UI Overview",
    url: "https://developer.paypal.com/braintree/docs/start/drop-in/",
    category: "dropin_ui",
  },
  {
    name: "Node.js Drop-in Tutorial",
    url: "https://developer.paypal.com/braintree/docs/start/tutorial-drop-in-node/",
    category: "dropin_ui",
  },
  {
    name: "Hosted Fields Overview",
    url: "https://developer.paypal.com/braintree/docs/start/hosted-fields/",
    category: "hosted_fields",
  },
  {
    name: "Node.js Hosted Fields Tutorial",
    url: "https://developer.paypal.com/braintree/docs/start/tutorial-hosted-fields-node/",
    category: "hosted_fields",
  },
  {
    name: "Braintree Apple Pay",
    url: "https://developer.paypal.com/braintree/docs/guides/apple-pay/overview/",
    category: "braintree_apple_pay",
  },
  {
    name: "Braintree Google Pay",
    url: "https://developer.paypal.com/braintree/docs/guides/google-pay/overview/",
    category: "braintree_google_pay",
  },
  {
    name: "Braintree Local Payment Methods Overview",
    url: "https://developer.paypal.com/braintree/docs/guides/local-payment-methods/overview/",
    category: "braintree_lpm",
  },
];

// Supported language options
const supportedLanguages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "it", label: "Italian" },
  { code: "de", label: "German" },
];

// Grouping helper
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

const EmailMarkdownEditor = () => {
  const [merchantName, setMerchantName] = useState(() => {
    try {
      return localStorage.getItem("merchantName") || "";
    } catch {
      return "";
    }
  });
  const [engineerName, setEngineerName] = useState(() => {
    try {
      return localStorage.getItem("engineerName") || "";
    } catch {
      return "";
    }
  });
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("emailLanguage") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("merchantName", merchantName);
    } catch {}
  }, [merchantName]);
  useEffect(() => {
    try {
      localStorage.setItem("engineerName", engineerName);
    } catch {}
  }, [engineerName]);

  useEffect(() => {
    try {
      localStorage.setItem("emailLanguage", language);
    } catch {}
  }, [language]);

  function replaceVariables(text) {
    return text
      .replace(/\{\{merchantName\}\}/g, merchantName)
      .replace(/\{\{engineerName\}\}/g, engineerName);
  }

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("darkMode") || "false");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // ✅ Save to localStorage
    try {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    } catch {} // ✅ Apply the correct class to <html>

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [emailName, setEmailName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [savedEmails, setSavedEmails] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedEmails") || "[]");
    } catch {
      return [];
    }
  });
  const [selectedEmailKey, setSelectedEmailKey] = useState("introduction");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [editorSelection, setEditorSelection] = useState({ start: 0, end: 0 });
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Template field getter for translation/fallback
  const getTemplateField = (template, field) => {
    const val = template[field];
    if (!val) return "";
    if (typeof val === "string") return val;
    return val?.[language] || val?.en || "";
  };

  // Category label getter for translation/fallback
  const getCategoryLabel = (key) =>
    documentationCategories[key]?.[language] ||
    documentationCategories[key]?.en ||
    key;

  const isSavedEmail = savedEmails.some((e) => e.key === selectedEmailKey);

  useEffect(() => {
    const found =
      savedEmails.find((e) => e.key === selectedEmailKey) ||
      premadeTemplates.find((e) => e.key === selectedEmailKey);
    if (found) {
      setSubject(getTemplateField(found, "subject"));
      setBody(getTemplateField(found, "body"));
      setEmailName(getTemplateField(found, "name") || "");
      setHistory([getTemplateField(found, "body")]);
      setRedoStack([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmailKey, language]);

  // Markdown editor history management
  const updateBody = (newBody) => {
    setBody(newBody);
    setHistory([...history, newBody]);
    setRedoStack([]);
  };

  const showTempFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3000);
  };

  async function copyToClipboardFallback(text) {
    try {
      // Modern API, only works on HTTPS or localhost
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for http: or unsupported context
      const textarea = document.createElement("textarea");
      textarea.value = text;
      // Move it off-screen
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        return true;
      } catch (err2) {
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

  const copyToClipboard = async () => {
    const content = `Subject: ${replaceVariables(
      subject
    )}\n\n${replaceVariables(body)}`.trim();
    if (!content) {
      showTempFeedback("error", "Nothing to copy");
      return;
    }
    const ok = await copyToClipboardFallback(content);
    if (ok) showTempFeedback("success", "Copied to clipboard!");
    else showTempFeedback("error", "Failed to copy.");
  };

  const saveEmail = () => {
    if (!emailName.trim()) {
      alert("Please enter an email name.");
      return;
    }

    const newEmail = {
      key: `saved-${Date.now()}`,
      name: emailName,
      subject,
      body,
      language, // ✅ include current selected language
    };

    const updated = [...savedEmails, newEmail];
    setSavedEmails(updated);
    try {
      localStorage.setItem("savedEmails", JSON.stringify(updated));
    } catch {}

    setShowSaveModal(false);
    setEmailName("");
    showTempFeedback("success", "Email saved successfully!");
  };

  const updateSavedEmail = () => {
    if (!selectedEmailKey || !isSavedEmail) return;
    const updatedEmail = {
      key: selectedEmailKey,
      name: emailName || subject.slice(0, 20),
      subject,
      body,
    };
    const updatedList = savedEmails.map((e) =>
      e.key === selectedEmailKey ? updatedEmail : e
    );
    setSavedEmails(updatedList);
    try {
      localStorage.setItem("savedEmails", JSON.stringify(updatedList));
    } catch {}
    showTempFeedback("success", "Email updated successfully!");
  };

  const saveAsCopy = () => {
    const copyName = emailName ? `${emailName} (Copy)` : "Untitled Copy";
    const newEmail = {
      key: `saved-${Date.now()}`,
      name: copyName,
      subject,
      body,
      language, // ✅ save language
    };

    const updated = [...savedEmails, newEmail];
    setSavedEmails(updated);
    try {
      localStorage.setItem("savedEmails", JSON.stringify(updated));
    } catch {}

    showTempFeedback("success", "Email saved as a copy!");
  };

  const deleteEmail = (key) => {
    const updated = savedEmails.filter((e) => e.key !== key);
    setSavedEmails(updated);
    try {
      localStorage.setItem("savedEmails", JSON.stringify(updated));
    } catch {}
    if (selectedEmailKey === key) setSelectedEmailKey("");
    showTempFeedback("error", "Email deleted.");
  };

  // Undo/redo management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (history.length > 0) {
          const prevState = history[history.length - 1];
          setRedoStack([...redoStack, body]);
          setBody(prevState);
          setHistory(history.slice(0, -1));
        }
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        ((e.shiftKey && e.key === "z") || e.key === "y")
      ) {
        e.preventDefault();
        if (redoStack.length > 0) {
          const nextState = redoStack[redoStack.length - 1];
          setHistory([...history, body]);
          setBody(nextState);
          setRedoStack(redoStack.slice(0, -1));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [body, history, redoStack]);

  // Category grouping
  const groupedLinks = groupBy(documentationLinks, "category");
  const allCategories = Object.keys(groupedLinks);

  // Insert documentation links in markdown, respecting language for headings
  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const isLinkAlreadyPresent = (url) => {
    const linkObj = documentationLinks.find((l) => l.url === url);
    if (!linkObj) return false;
    const regex = new RegExp(
      `\\[${escapeRegExp(linkObj.name)}\\]\\(${escapeRegExp(linkObj.url)}\\)`,
      "m"
    );
    return regex.test(body);
  };

  const addMultipleLinks = (links) => {
    if (!links.length) return;

    const grouped = links.reduce((acc, link) => {
      if (!isLinkAlreadyPresent(link.url)) {
        if (!acc[link.category]) acc[link.category] = [];
        acc[link.category].push(`[${link.name}](${link.url})`);
      }
      return acc;
    }, {});

    const categories = Object.keys(grouped);
    if (categories.length === 0) {
      showTempFeedback("error", "All selected links are already added");
      return;
    }

    const markdownBlocks = categories.map((cat) => {
      const label = getCategoryLabel(cat);
      const linksText = grouped[cat].join("\n");
      return `**${label}:**\n${linksText}`;
    });

    const markdownLinks = markdownBlocks.join("\n") + "\n";
    const { start, end } = editorSelection;
    const newBody = body.slice(0, start) + markdownLinks + body.slice(end);
    updateBody(newBody);

    setTimeout(() => {
      const el = document.getElementById("email-editor");
      if (el) {
        const newCursorPos = start + markdownLinks.length;
        el.focus();
        el.selectionStart = el.selectionEnd = newCursorPos;
      }
    }, 0);

    showTempFeedback(
      "success",
      `Added ${links.length} link${links.length > 1 ? "s" : ""}`
    );
  };

  // Remove a documentation link from the editor (also cleans up empty headings)
  const removeLinkFromBody = (url) => {
    const link = documentationLinks.find((l) => l.url === url);
    if (!link) return;

    const markdownLinkRegex = new RegExp(
      `\\[${escapeRegExp(link.name)}\\]\\(${escapeRegExp(link.url)}\\)\\n?`,
      "g"
    );
    const headingRegex = new RegExp(
      `\\*\\*${escapeRegExp(
        getCategoryLabel(link.category)
      )}:\\*\\*\\n((\\[.*\\]\\(.*\\)\\n?)*)`,
      "g"
    );

    let newBody = body.replace(markdownLinkRegex, "");
    newBody = newBody.replace(/\n{3,}/g, "\n\n").trim();

    // Remove heading if no markdown links follow it
    newBody = newBody.replace(headingRegex, (match, links) => {
      if (!links.trim()) return "";
      return match;
    });

    updateBody(newBody);
  };

  // Track inserted documentation links
  const getAddedLinks = () => {
    return documentationLinks.filter((link) => {
      const regex = new RegExp(
        `\\[${escapeRegExp(link.name)}\\]\\(${escapeRegExp(link.url)}\\)`,
        "m"
      );
      return regex.test(body);
    });
  };

  const addedLinks = getAddedLinks();

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}>
      {/* Navbar */}
      <header className={`p-4 border-b dark:border-gray-700`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold flex-shrink-0">
            Email Markdown Editor
          </h1>
          <div className="flex flex-1 flex-wrap items-center justify-evenly gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Merchant Name
              </label>
              <input
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-36"
                placeholder="Merchant name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Engineer Name
              </label>
              <input
                value={engineerName}
                onChange={(e) => setEngineerName(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-36"
                placeholder="Engineer name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Select Email
              </label>
              <select
                value={selectedEmailKey}
                onChange={(e) => setSelectedEmailKey(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-44">
                {/*   <option value="">-- Choose --</option>  */}
                {premadeTemplates.map((t) => (
                  <option key={t.key} value={t.key}>
                    {getTemplateField(t, "name")}
                  </option>
                ))}
                {savedEmails
                  .filter((t) => t.language === language) // ✅ filter by language
                  .map((t) => (
                    <option key={t.key} value={t.key}>
                      Saved: {t.name}   
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-36">
                {supportedLanguages.map((lng) => (
                  <option key={lng.code} value={lng.code}>
                    {lng.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px] max-w-xs">
              <label className="block text-xs font-semibold mb-1">
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-full"
                placeholder="Subject"
              />
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      {feedback.message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white transition-opacity duration-300 z-50 ${
            feedback.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
          {feedback.type === "success" ? (
            <CheckCircle className="inline mr-1" />
          ) : (
            <XCircle className="inline mr-1" />
          )}{" "}
          {feedback.message}
        </div>
      )}

      <main className="max-w-screen-xl mx-auto p-6 space-y-6">
        {/* Editor and Preview Side by Side */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <label className="block mb-2 font-semibold">Body</label>
            <textarea
              id="email-editor"
              value={body}
              onChange={(e) => updateBody(e.target.value)}
              onClick={(e) =>
                setEditorSelection({
                  start: e.target.selectionStart,
                  end: e.target.selectionEnd,
                })
              }
              onKeyUp={(e) =>
                setEditorSelection({
                  start: e.target.selectionStart,
                  end: e.target.selectionEnd,
                })
              }
              onFocus={(e) =>
                setEditorSelection({
                  start: e.target.selectionStart,
                  end: e.target.selectionEnd,
                })
              }
              rows={18}
              className="w-full p-2 font-mono rounded border dark:bg-gray-800 dark:border-gray-600 resize-y min-h-[300px]"
            />
          </div>
          {/* Preview */}
          <div className="flex-1 flex flex-col">
            <h4 className="font-semibold mb-2">Preview</h4>
            <div>
              <strong>Subject:</strong> {replaceVariables(subject)}
            </div>
            <div className="whitespace-pre-line prose dark:prose-invert bg-gray-100 dark:bg-gray-900 rounded p-4 min-h-[350px] max-h-[425px] overflow-y-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {replaceVariables(body)}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Add Documentation Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Link className="w-5 h-5" />
            Add Documentation Links
          </h3>
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium">
              Select links to add:
            </label>
            <div className="max-h-64 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
              {allCategories.map((category) => (
                <div key={category}>
                  <div className="font-semibold mb-1 mt-2">
                    {getCategoryLabel(category)}
                  </div>
                  {groupedLinks[category].map((link) => (
                    <label
                      key={link.url}
                      className="flex items-center gap-2 pl-3 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        value={link.url}
                        checked={selectedLinks.includes(link.url)}
                        onChange={(e) => {
                          const url = link.url;
                          setSelectedLinks((prev) =>
                            e.target.checked
                              ? [...prev, url]
                              : prev.filter((u) => u !== url)
                          );
                        }}
                      />
                      <span className="text-sm">{link.name}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              const linksToAdd = selectedLinks
                .map((url) =>
                  documentationLinks.find((link) => link.url === url)
                )
                .filter(Boolean);
              addMultipleLinks(linksToAdd);
              setSelectedLinks([]);
            }}
            disabled={selectedLinks.length === 0}
            className="mt-2 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" />
            Add Selected Links
          </button>
        </div>

        {addedLinks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Link className="w-5 h-5" />
              Added Links ({addedLinks.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {addedLinks.map((link) => (
                <div
                  key={link.url}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {link.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getCategoryLabel(link.category)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeLinkFromBody(link.url);
                      showTempFeedback("success", `Removed ${link.name}`);
                    }}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            <Copy className="w-4 h-4" /> Copy Email
          </button>
          {!isSavedEmail && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <Save className="w-4 h-4" /> Save Email
            </button>
          )}
          {isSavedEmail && (
            <>
              <button
                onClick={updateSavedEmail}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                <Save className="w-4 h-4" /> Update Email
              </button>
              <button
                onClick={saveAsCopy}
                className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                <Save className="w-4 h-4" /> Save as Copy
              </button>
            </>
          )}
        </div>

        {savedEmails.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Saved Emails</h2>
            <ul className="space-y-2">
              {savedEmails.map((email) => (
                <li
                  key={email.key}
                  className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <span>{email.name}</span>
                  <button onClick={() => deleteEmail(email.key)}>
                    <Trash className="w-4 h-4 text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Save Email</h3>
            <input
              value={emailName}
              onChange={(e) => setEmailName(e.target.value)}
              placeholder="Enter name"
              className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700">
                Cancel
              </button>
              <button
                onClick={saveEmail}
                className="px-4 py-2 rounded bg-blue-600 text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailMarkdownEditor;
