const utils = require('@alextim/utils');

const weekDays = {
  mo: 'Monday',
  tu: 'Tuesday',
  we: 'Wednesday',
  th: 'Thursday',
  fr: 'Friday',
  sa: 'Saturday',
  su: 'Sunday',
};

/*
const getOpeningHours = (openingHours, dows) => {
  const parseDow = (s) => {
    if (!s) {
      return '';
    }
    const dow = s.split('-');
    if (dow.length === 1) {
      return dows[s];
    }
    return `${dows[dow[0]]}-${dows[dow[1]]}`;
  };
  const a = openingHours.reduce(
    (acc, [dow, timeStart, timeFinish]) =>
      `${acc}${acc ? ', ' : ''}${parseDow(dow)}: ${timeStart}-${timeFinish}`,
    '',
  );
  return a.length === 1 ? a[0] : a;
};
*/
const getOpeningHoursSpecification = (openingHours) => {
  const parseDow = (s) => {
    if (!s) {
      return undefined;
    }

    let dow = s.split('-');
    if (dow.length > 1) {
      const d1 = dow[0].trim();
      const d2 = dow[1].trim();
      const keys = Object.keys(weekDays);
      const a = [];
      let first = false;
      let last = false;
      keys.forEach((d) => {
        if (d === d1) {
          first = true;
          a.push(weekDays[d]);
        } else if (d === d2) {
          last = true;
          a.push(weekDays[d]);
        } else if (first && !last) {
          a.push(weekDays[d]);
        }
      });
      return a;
    }

    dow = s.split(',');
    if (dow.length > 1) {
      return dow.map((d) => weekDays[d.trim()]);
    }
    return weekDays[s.trim()];
  };

  return openingHours.map(([dow, timeStart, timeFinish]) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: parseDow(dow),
    opens: timeStart,
    closes: timeFinish,
  }));
};

const getOrganizationSchema = ({
  orgContacts,
  orgAddress = {},
  config,
  /* dows,  */
  socialLinks,
}) => {
  const {
    organizationType,
    geo,
    openingHours,
    phone: organizationPhone,
    email: organizationEmail,
    hasMap,
    priceRange,
    currenciesAccepted,
    paymentAccepted,
  } = orgContacts;

  const { name: organizationName, legalName, alternateName, description, postalAddress, contactPoint } = orgAddress;

  const schema = {
    '@context': 'https://schema.org',
    '@type': organizationType,
    '@id': `${config.siteUrl}/#Organization`,
    name: organizationName,
    description,
    url: config.siteUrl,
    logo: config.siteLogo,
  };
  if (config.siteBusinessPhoto) {
    schema.image = Array.isArray(config.siteBusinessPhoto) ? [...config.siteBusinessPhoto] : config.siteBusinessPhoto;
  }

  if (postalAddress) {
    const o = {
      '@type': 'PostalAddress',
      ...postalAddress,
    };
    if (postalAddress.streetAddress) {
      o.streetAddress = postalAddress.streetAddress.join(', ');
    }
    delete o.addressCountryName;
    schema.address = o;
  }

  if (legalName) {
    schema.legalName = legalName;
  }
  if (alternateName) {
    schema.alternateName = alternateName;
  }

  if (organizationPhone) {
    schema.telephone = utils.formatPhone(organizationPhone[0]);
  }
  if (organizationEmail) {
    [schema.email] = organizationEmail;
  }

  if (geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      ...geo,
    };
  }

  if (contactPoint) {
    schema.contactPoint = contactPoint.map(({ name, contactType, telephone, email, areaServed }) => {
      const o = {
        '@type': 'ContactPoint',
        name,
        contactType,
      };
      if (telephone) {
        o.telephone = telephone.reduce((acc, curr) => `${acc}${acc ? ', ' : ''}${utils.formatPhone(curr)}`, '');
      }
      if (email) {
        o.email = email.join();
      }
      if (areaServed) {
        o.areaServed = areaServed;
      }
      return o;
    });
  }

  if (socialLinks) {
    schema.sameAs = Object.keys(socialLinks).map((key) => socialLinks[key].to);
  }

  if (currenciesAccepted) {
    schema.currenciesAccepted = currenciesAccepted;
  }
  if (paymentAccepted) {
    schema.paymentAccepted = paymentAccepted;
  }
  if (priceRange) {
    schema.priceRange = priceRange;
  }

  if (Array.isArray(openingHours)) {
    /*
    if (dows) {
      schema.openingHours = getOpeningHours(openingHours, dows);
    }
    */
    schema.openingHoursSpecification = getOpeningHoursSpecification(openingHours);
  }

  if (hasMap) {
    schema.hasMap = hasMap;
  }

  return schema;
};

module.exports = getOrganizationSchema;
