import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
const app = express();
const router = express.Router();
export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};


export const scrapedata = async (req, res, next) => {
    const { location, description } = req.body;
    const { serviceType } = req.params;

    console.log(serviceType);

    if (!location || !description) {
        return res.status(400).json({ error: 'Location and description are required.' });
    }

    const url = `https://www.justdial.com/${location}/${description}/`;

    try {
        // Fetch the HTML of the page
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const results = [];

        $('.resultbox_info').each((index, element) => {
            const service_provider = $(element).find('.resultbox_title_anchor.line_clamp_1').text().trim();
            const specialization =  $(element).find('.catalogue_title.font14.fw500.color111').text().trim();
            const rating = $(element).find('.resultbox_totalrate').text().trim();
            const reviewsText = $(element).find('.resultbox_countrate').text().trim();
            // Extract only the numeric part from reviewsText
            const reviews = reviewsText.split(' ')[0]; // Split by space and take the first part
            const locationText = $(element).find('.font15.fw400.color111').text().trim();
            const phone = $(element).find('.callcontent').text().trim();
            const href = $(element).find('.resultbox_title_anchorbox').attr('href');
            const website = `https://www.justdial.com${href}`
            

            results.push({
                service_provider,
                specialization,
                rating,
                reviews,
                location: locationText,
                phone,
                website,

            });
        });

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape data.' });
    }
};